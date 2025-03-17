import { HttpStatus } from "../enums/http-status-enums.js";
import { Helper } from "../helpers/helpers.js";
import { HttpResponse } from "../models/http-response.js";

export class VersionController {
    constructor(versionService, processService) {
        this.versionService = versionService;
        this.processService = processService;
    }

    async isVersionExists(req, res, next) {
        try {
            let result = await this.versionService.isVersionExists(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async saveNewVersion(req, res, next) {
        try {
            let currentUsername = req.user.user.username;
            let result = await this.versionService.saveNewVersion(req.body, currentUsername);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async editVersion(req, res, next) {
        try {
            let result = await this.versionService.editVersion(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async uploadVersion(req, res, next) {
        try {
            if (!req.files) {
                return res.status(400).send('No files uploaded.');
            }
            
            if (req.failedFiles && req.failedFiles.length > 0) {
                return res.status(400).json({
                    error: 'Some files already exist.',
                    failedFiles: req.failedFiles,
                    uploadedFiles: req.files.map(file => file.originalname)
                });
            }
            
            const { processName, isCreate } = req.body;
            const creatorId = req.user.user.id;
            
            const process = await this.processService.createProcess(processName, isCreate, creatorId);
            if (process) {
                res.status(HttpStatus.CREATED).json(new HttpResponse(process, "Created process successfully."));
                return;
            }

            res.status(HttpStatus.OK).json(new HttpResponse("OK", null));
        } catch (error) {
            next(error);
        }
    }

    async executeVersion(req, res, next) {
        try {
            Helper.validateRequest(req, res);
            let result = await this.versionService.executeVersion(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse("OK", null));
        } catch (error) {
            next(error);
        }
    }
}