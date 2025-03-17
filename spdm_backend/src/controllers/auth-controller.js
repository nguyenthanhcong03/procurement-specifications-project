import { HttpStatus } from "../enums/http-status-enums.js";
import { HttpResponse } from "../models/http-response.js";
import { Helper } from "../helpers/helpers.js";

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res, next) {
        try {
            Helper.validateRequest(req, res);

            let result = await this.authService.login(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            Helper.validateRequest(req, res);

            let result = await this.authService.register(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }
}