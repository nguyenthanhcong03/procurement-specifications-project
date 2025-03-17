import { NodeLabelsEnums, PythonOutputTypesEnums } from "../enums/enums.js";
import { Helper } from "../helpers/helpers.js";
import fs from 'fs';

export class VersionService {
    constructor (versionRepository) {
        this.versionRepository = versionRepository;
    }

    /**
     * Checks if a version name is exists.
     * 
     * @async
     * @param {Object} userPayload - The data containing the version name.
     * @param {string} userPayload.versionName - The version name.
     * @returns {Promise<boolean>} - Returns true if the version name is exists, false otherwise.
     */
    async isVersionExists(userPayload) {
        if (Helper.isEmptyString(userPayload)) {
            return false;
        }
        const versionName = userPayload.versionName?.trim();
        const processName = userPayload.processName?.trim();
        return this.versionRepository.isVersionExists(versionName, processName);
    }

    /**
     * Save new version data.
     * 
     * @async
     * @param {Object} userPayload - The data containing the elements.
     * @param {string} userPayload.elements - The elements.
     * @param {string} currentUsername - The current username.
     * @returns {Promise<boolean>}
     */
    async saveNewVersion(userPayload, currentUsername) {
        const session = this.versionRepository.driver.session().beginTransaction();
        try {
            let nodeElements = [];
            let edgeElements = [];

            userPayload.elements.forEach(element => {
                if (element['group'] == 'nodes') {
                    element['data']['properties']['position'] = JSON.stringify(element['position'] ?? '');
                    nodeElements.push(element['data']);
                } else if (element['group'] == 'edges') {
                    edgeElements.push(element['data']);
                }
            });

            let result = await this.versionRepository.saveNewVersion(nodeElements, edgeElements, currentUsername);
            await session.commit();
            return result;
        } catch (e) {
            console.log(e);
            await session.rollback();
            throw e;
        } finally {
            await session.close();
        }
    }
    
    /**
     * Edit version data.
     * 
     * @async
     * @param {Object} userPayload - The data containing the elements.
     * @param {string} userPayload.elements - The elements.
     * @param {string} userPayload.processName - The process name.
     * @param {string} userPayload.versionName - The version name.
     * @returns {Promise<boolean>}
     */
    async editVersion(userPayload) { 
        if (await this.versionRepository.deleteVersionData(userPayload.versionName, userPayload.processName)) {
            // return this.saveNewVersion(userPayload);
            return true;
        }
        return false;
    }

    /**
     * Retrieves a paginated list of versions of selected process.
     *
     * @param {object} userPayload - The payload containing pagination parameters.
     * @param {string} userPayload.processName - The name of the process.
     * @param {number} userPayload.pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} userPayload.pageSize - The number of items per page.
     * @param {string} userPayload.search - The search term to filter the version names or creator names.
     * @returns {Promise<any>} - The paginated version data from the repository.
     */
    async pagingProcessVersion(userPayload) { 
        let processName = userPayload.processName ?? '';
        let pageIndex = userPayload.pageIndex ?? 1;
        let pageSize = userPayload.pageSize ?? 10;
        let search = userPayload.search ?? '';
        let fromDate = userPayload.fromDate ?? '1970-01-01T00:00:00Z';
        let toDate = userPayload.toDate ?? '2099-01-01T00:00:00Z';
        
        return this.versionRepository.pagingProcessVersion(processName, pageIndex, pageSize, search, fromDate, toDate);
    }

    /**
     * Retrieves all data of the version by process.
     * 
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @returns {Promise<boolean|Object>} - Returns `false` if version name is empty, or the version data object if found.
     */
    async getVersionOfProcess(processName, versionName) {
        if (Helper.isEmptyString(processName) || Helper.isEmptyString(versionName)) {
            return false;
        }

        let result = await this.versionRepository.getVersionOfProcess(processName.trim(), versionName.trim());
        return this.#processingVersionData(result);
    }

    /**
     * Retrieves all data of the latest version by process.
     * 
     * @param {string} processName - The name of the process.
     * @returns {Promise<boolean|Object>} - Returns `false` if version name is empty, or the version data object if found.
     */
    async getLatestVersionOfProcess(processName) {
        if (Helper.isEmptyString(processName)) {
            return false;
        }

        let result = await this.versionRepository.getLatestVersionOfProcess(processName.trim());
        return this.#processingVersionData(result);
    }

    /**
     * Executes the version program.
     * @param {object} userPayload - The payload containing parameters.
     * @param {string} userPayload.processName - The name of the process.
     * @param {string} userPayload.versionName - The name of the version.
     */
    async executeVersion(userPayload) {
        const session = this.versionRepository.driver.session().beginTransaction();
        this.executeExcel('fileA.xlsx', 'processB', 'verB', session);
        return
        try {
            const processName = userPayload.processName;
            const versionName = userPayload.versionName;

            let fileSet = new Set();
            let execLst = await this.versionRepository.getExecuteList(processName, versionName);
            execLst = execLst.records.map(function (element) {
                fileSet.add(element.get('from'));
                fileSet.add(element.get('to'));
                return `${element.get('from')}->${element.get('to')}` // return 'fileA.py->fileB.py'
            });

            while (fileSet.size > 0) {
                const [fileName] = fileSet; // get first fileName from fileSet
                
                // if fileName is base on other file, run next loop
                if (!execLst.some(element => element.endsWith(fileName))) {
                    if (fileName.endsWith('.py')){
                        await this.executePython(fileName, processName, versionName, session);
                    } else if (fileName.endsWith('.xlsx')) {
                        await this.executeExcel(fileName, processName, versionName, session);
                    }
                    // set the value to the dependent file 
                    await this.versionRepository.setDependencyValue(fileName, processName, versionName, session);

                    execLst = execLst.filter(element => !element.startsWith(fileName));
                    fileSet.delete(fileName); // remove when finish
                } else { // push to end of set
                    fileSet.delete(fileName);
                    fileSet.add(fileName);
                }
            }
            
            console.log("Execute success");
            await session.commit();
        } catch (e) {
            console.log(e);
            await session.rollback();
            throw e;
        } finally {
            await session.close();
        }
    }

    /**
     * Executes the python program.
     * 
     * @param {string} fileName - The name of the Python file to execute.
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {Object} session - The Neo4j session to use for the query.
     * @returns {Promise<void>}
     * @throws {HttpException} - Throws an exception if there is an error executing the Python file.
     */
    async executePython(fileName, processName, versionName, session) {
        const storageDir = process.env.STORAGE_DIR ?? '/usr/src/storage';
        let filePath = `${storageDir}/${fileName}`;
        let tempFilePath = `${storageDir}/temp_${Date.now()}_${fileName}`;
        let result = undefined;

        // Make a temporary copy for the file
        fs.copyFileSync(filePath, tempFilePath);

        // Get all file input
        let inputs = await this.versionRepository.getFileNodeInputs(fileName, processName, versionName);
        inputs = inputs.records.map(function (input) {
            const props = input.get('input').properties;
            return {name: props.key1, value: props.key2};
        });
        // Update input values to temporary file 
        Helper.updatePythonInputValue(tempFilePath, inputs);
        
        // Execute python then return the value
        const fileType = Helper.getPythonFileType(tempFilePath);
        if (fileType == PythonOutputTypesEnums.PRINT) {
            result = await Helper.executePythonPrintFile(tempFilePath);
        } else if (fileType == PythonOutputTypesEnums.RETURN) {
            Helper.convertPythonReturnToPrint(tempFilePath);
            result = await Helper.executePythonPrintFile(tempFilePath);
        } else if (fileType == PythonOutputTypesEnums.CSV) {
            // TODO
        }
        
        // remove the temporary file
        fs.unlinkSync(tempFilePath);
        // save the value to db
        if (result) {
            this.versionRepository.saveSingleResultFileValue(fileName, processName, versionName, result, session);
        }
    }

    /**
     * Executes the excel file.
     * 
     * @param {string} fileName - The name of the Excel file to execute.
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {Object} session - The Neo4j session to use for the query.
     * @returns {Promise<void>}
     * @throws {HttpException} - Throws an exception if there is an error executing the Excel file.
     */
    async executeExcel(fileName, processName, versionName, session) {
        const storageDir = process.env.STORAGE_DIR ?? '/usr/src/storage';
        let filePath = `${storageDir}/${fileName}`;
        let tempFilePath = `${storageDir}/temp_${Date.now()}_${fileName}`;
        // let result = undefined;

        // Make a temporary copy for the file
        fs.copyFileSync(filePath, tempFilePath);

        // Get all file input
        let inputs = await this.versionRepository.getFileNodeInputs(fileName, processName, versionName);
        inputs = inputs.records.map(function (input) {
            const props = input.get('input').properties;
            return {name: props.key1, value: props.key2};
        });
        // Update input values to temporary file 
        await Helper.updateExcelInputValue(tempFilePath, inputs);
        
        // Get values from the Excel file then save to db
        
        // remove the temporary file
        fs.unlinkSync(tempFilePath);
    }

    /**
     * Processes version data by mapping elements and edges from the result.
     * 
     * @param {Object} result - The result object containing elements and edges records.
     * @returns {Object} - The processed result with mapped elements and edges.
     * @private
     */
    async #processingVersionData(result) {
        result.elements = result.elements.records.map(function (r){
            let element = r.get('n');
            return {
                "group": "nodes",
                "data": {
                    "id": element.elementId,
                    "label": element.labels[0],
                    "properties": element.properties,
                },
                "position": JSON.parse(element.properties.position ?? '{}')
            };
        });
        result.edges = result.edges.records.map(function (r){
            let element = r.get('r');
            return {
                "group": "edges",
                "data": {
                    "id": element.elementId,
                    "source": element.startNodeElementId,
                    "target": element.endNodeElementId,
                    "label": element.type,
                    "properties": element.properties,
                },
            };
        });
        result = this.#setupSubLabel(result);
        return result;
    }

    async #setupSubLabel(result) {
        let subLabelList = [];
        result.elements.forEach(element => {
            if (element['data']['label'] == NodeLabelsEnums.LABEL3) {
                subLabelList.push({
                    "group": "nodes", 
                    "data": {"id": `sl${subLabelList.length + 1}`, "label": NodeLabelsEnums.SUBLABEL, "sublabel": element['data']['properties']['sublabel']}
                });
            } 
        });
        subLabelList.forEach(subLabel => {
            result.elements = result.elements.map(function (element){
                if (element['data']['properties']['sublabel'] == subLabel['data']['sublabel']) {
                    element['data']['parent'] = subLabel['data']['id'];
                } 
                return element;
            });
        });

        result.elements.push(...subLabelList);
        return result;
    }
}