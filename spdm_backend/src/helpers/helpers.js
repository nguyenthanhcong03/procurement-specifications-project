import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../enums/http-status-enums.js';
import { HttpException } from '../models/http-exception.js';
import multer from 'multer';
import * as fs from 'fs';
import { PythonOutputTypesEnums } from '../enums/enums.js';
import { promisify } from "util";
import { exec } from "child_process";
import * as ExcelJs from 'exceljs';

/**
 * Helper class for utility functions.
 * 
 * @class Helper
 * @description This class contains helper methods, including JWT token generation.
 */
export class Helper {

    /**
     * Generates a JWT token.
     * 
     * @param {object} user - The user object to be included in the token.
     * @returns {string} - The generated JWT token.
     * @description This method generates a JSON Web Token (JWT) containing the user's ID and an expiration time.
     * The token is signed using a secret key stored in the environment variable `JWT_SECRET`, or a fallback key ('superSecret').
     * The expiration time is also configurable via the `JWT_EXPIRE` environment variable.
     */
    static generateToken(user) {
        return jwt.sign(
            { user }, 
            process.env.JWT_SECRET || 'superSecret', 
            { expiresIn: process.env.JWT_EXPIRE || '60d',}
        );
    }

    /**
     * Validates the request using express-validator.
     * 
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {boolean} - Returns false if there are validation errors, otherwise true.
     * @description This method validates the request using express-validator and returns a JSON response with validation errors if any are found.
     */
    static validateRequest(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new HttpException(HttpStatus.BAD_REQUEST, {errors: errors.array(),});
        }
    }

    /**
     * Initializes the upload middleware.
     * This function sets up the middleware for handling file uploads.
     */
    static initUploadMiddleware() {
        const storageDir = process.env.STORAGE_DIR ?? '/usr/src/storage';
        // Ensure the directory exists
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        // const processName = req.params['processName'] ?? '';
        // if (!fs.existsSync(`${storageDir}/${processName}`)) {
        //     fs.mkdirSync(`${storageDir}/${processName}`, { recursive: true });
        // }
        const processName = '';
        const folderPath = `${storageDir}/${processName}`;
        // Multer configuration for image uploads
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, folderPath); 
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        });
    
        const fileFilter = (req, file, cb) => {
            const filePath = `${folderPath}/${file.originalname}`;
    
            if (fs.existsSync(filePath)) {    // Skip overwriting existing files
                req.failedFiles = req.failedFiles || [];
                req.failedFiles.push(file.originalname);
                console.log(req.failedFiles);
                cb(null, false);
            } else {
                cb(null, true);
            }
        };
    
        const upload =  multer({ storage, fileFilter });
        return upload;
    }

    /**
     * Utility method to check if a value is an empty string, null, or undefined.
     * 
     * @param {string|null|undefined} value - The value to be checked. Can be a string, null, or undefined.
     * @returns {boolean} - Returns `true` if the value is null, undefined, or an empty string; otherwise, `false`.
     */
    static isEmptyString(value) {
        return value === null || value === undefined || value === '';
    }

    /**
     * Deletes files from the file system.
     * 
     * @param {Array<string>} files - The list of files to be deleted.
     * @returns {boolean} - Returns `true` if the files are deleted successfully; otherwise, `false`.
     * @description This method deletes files from the file system using the `fs` module.
     */
    static deleteFiles(files) {
        try {
            files.forEach(file => {
                fs.unlinkSync(file);
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Get python file output type [Print, Return, Csv]
     * 
     * @param {string} filepath
     * @returns {string}
     */
    static getPythonFileType(filepath) {
        if (fs.existsSync(filepath)) {
            const data = fs.readFileSync(filepath, 'utf-8');
            const functionIndices = this.getFunctionIndices(filepath, "main");
            const mainFunc = data.split("\n").slice(functionIndices.startIndex, functionIndices.endIndex);
            for (const row of mainFunc.reverse()) {
                if (row.trim().startsWith('print')) {
                    return PythonOutputTypesEnums.PRINT;
                } else if (row.trim().startsWith('return')) {
                    return PythonOutputTypesEnums.RETURN;
                } else if (row.trim().includes('to_csv')) {
                    return PythonOutputTypesEnums.CSV;
                }
            }
        } else {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, {message: `${filepath} doesn't exists`});
        }
    }

    /**
     * Gets the start and end row indices of a specified function in a Python file.
     * 
     * @param {string} filePath - The path to the Python file.
     * @param {string} functionName - The name of the function to find.
     * @returns {Object} - An object containing the start and end indices of the function.
     * @description This method reads the Python file, splits it into lines, and finds the start and end indices of the specified function.
     */
    static getFunctionIndices(filePath, functionName) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
        let startIndex = -1;
        let endIndex = -1;
        let insideFunction = false;
    
        lines.forEach((line, index) => {
            if (line.trim().startsWith(`def ${functionName}(`)) {
                startIndex = index;
                insideFunction = true;
            } else if (insideFunction && line.trim() === '' && lines[index + 1] && lines[index + 1].trim().startsWith('def ')) {
                endIndex = index;
                insideFunction = false;
            }
        });
    
        // If the function is at the end of the file
        if (insideFunction) {
            endIndex = lines.length - 1;
        }
    
        return { startIndex, endIndex };
    }

    /**
     * Convert python 'return' file to 'print' and saves it.
     * 
     * @param {string} filePath - The path to the Python file.
     */
    static convertPythonReturnToPrint(filePath) {
        if (fs.existsSync(filePath)) {
            // Read the file contents
            const data = fs.readFileSync(filePath, 'utf-8');
            let rows = data.split('\n');
            
            // change main() to print(main())
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].trim() === 'main()') {
                    rows[i] = rows[i].replace('main()', 'print(main())');
                }
            }

            // Write the modified contents back to the file
            fs.writeFileSync(filePath, rows.join('\n'), 'utf-8');
        } else {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, {message: `${filepath} doesn't exists`});
        }
    }

    /**
     * Executes a Python file and returns the printed output.
     * 
     * @param {string} file - The path to the Python file to execute.
     * @returns {Promise<string>} - The printed output from the Python file.
     * @throws {HttpException} - Throws an exception if there is an error executing the Python file.
     * @private
     */
    static async executePythonPrintFile(file) {
        const execAsync = promisify(exec);
        try {
            const { stdout, stderr } = await execAsync(`python3 ${file}`);
            if (stderr) {
                throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, { message: stderr });
            }
            return stdout;
        } catch (error) {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, { message: error.message });
        }
    }

    /**
     * Updates the values of specified variables in a Python file.
     * 
     * @param {string} filePath - The path to the Python file.
     * @param {Array<{name: string, value: any}>} inputs - An array of objects containing the variable names and their new values.
     * @throws {HttpException} - Throws an exception if the file does not exist.
     */
    static updatePythonInputValue(filePath, inputs) {
        if (fs.existsSync(filePath)) {
            // Read the file contents
            const data = fs.readFileSync(filePath, 'utf-8');
            let rows = data.split('\n');

            // replace the value
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].trim().includes('__main__')) {
                    for (let j = i + 1; j < rows.length; j++) {
                        for (const input of inputs) {
                            if (rows[j].includes(input.name)) {
                                rows [j] = rows[j].substring(0, rows[j].indexOf(input.name)) + `${input.name} = ${input.value}`;
                            }
                        }
                    } 
                    break;
                }
            }

            // Write the modified contents back to the file
            fs.writeFileSync(filePath, rows.join('\n'), 'utf-8');
        } else {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, {message: `${filepath} doesn't exists`});
        }
    }

    /**
     * Updates the values of specified variables in a Excel file.
     * 
     * @param {string} filePath - The path to the Excel file.
     * @param {Array<{name: string, value: any}>} inputs - An array of objects containing the variable names and their new values.
     * @throws {HttpException} - Throws an exception if the file does not exist.
     */
    static async updateExcelInputValue(filePath, inputs) {
        if (fs.existsSync(filePath)) {
            // Read the file contents
            let workbook = new ExcelJs.default.Workbook();
            await workbook.xlsx.readFile(filePath);

            const sheet2 = workbook.worksheets[1];
            sheet2.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                const input = inputs.find($element => $element.name == row.getCell(1).value);
                if (input) {
                    row.getCell(2).value = input.value; 
                }
                row.getCell(2).numFmt = "0.000000"; 
            });
            const sheet1 = workbook.worksheets[1];
            sheet1.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                const input = inputs.find($element => $element.name == row.getCell(1).value);
                if (input) {
                    row.getCell(2).value = input.value;
                }
                row.getCell(2).numFmt = "0.000000";
            });
            // Write the updated workbook back to the file
            await workbook.xlsx.writeFile(filePath);
        } else {
            throw new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, {message: `${filepath} doesn't exists`});
        }
    }
}