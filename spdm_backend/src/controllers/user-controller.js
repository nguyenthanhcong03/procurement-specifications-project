import {Helper} from "../helpers/helpers.js";
import {HttpStatus} from "../enums/http-status-enums.js";
import {HttpResponse} from "../models/http-response.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async pagingUser(req, res, next) {
        try {
            Helper.validateRequest(req, res);
            let result = await this.userService.pagingUser(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse(result, null));
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            await this.userService.resetPassword(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse("OK", null));
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            await this.userService.changePassword(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse("OK", null));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            await this.userService.updateUser(req.body);
            res.status(HttpStatus.OK).json(new HttpResponse("OK", null));
        } catch (error) {
            next(error);
        }
    }
}