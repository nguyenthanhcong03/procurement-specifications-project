import { HttpStatus } from "../enums/http-status-enums.js";
import { Helper } from "../helpers/helpers.js";
import { HttpResponse } from "../models/http-response.js";

export class ProcessController {
    constructor(processService, versionService) {
        this.processService = processService;
        this.versionService = versionService;
    }

    async isProcessExists(req, res, next) {
        try {
            const processName = req.params.processName;
            let result = await this.processService.isProcessExists(processName.trim());
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async pagingProcess(req, res, next) {
        try {
            Helper.validateRequest(req, res);
            let result = await this.processService.pagingProcess(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async pagingVersion(req, res, next) {
        try {
            Helper.validateRequest(req, res);
            req.body.processName = req.params.processName;

            let result = await this.versionService.pagingProcessVersion(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async getVersionOfProcess(req, res, next) {
        try {
            const processName = req.params.processName;
            const versionName = req.params.versionName;
            let result = await this.versionService.getVersionOfProcess(processName, versionName);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async getLatestVersion(req, res, next) {
        try {
            const processName = req.params.processName;
            let result = await this.versionService.getLatestVersionOfProcess(processName);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }
}