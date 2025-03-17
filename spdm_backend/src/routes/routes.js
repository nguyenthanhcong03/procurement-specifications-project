import { Router } from 'express';
import { HttpResponse } from '../models/http-response.js';
import { HttpStatus } from '../enums/http-status-enums.js';
import diContainer from '../container/di-container.js';
import { authenticateToken } from '../middlewares/auth.js';
import { userRule, userRuleWithoutRole, pagingRule, processVersionRule } from '../middlewares/validation.js';
import { checkRole } from '../middlewares/check-role.js';
import { RolesEnums } from '../enums/enums.js';
import { Helper } from '../helpers/helpers.js';

export function setupRoutes(){
    const api = Router();
    const upload = Helper.initUploadMiddleware();

    // Resolve the UserController from DI container
    const authController = diContainer.resolve('authController');
    const versionController = diContainer.resolve('versionController');
    const userController = diContainer.resolve('userController');
    const processController = diContainer.resolve('processController');

    // Apis
    // // Auth
    api.post('/login', userRuleWithoutRole, (req, res, next) => authController.login(req, res, next));
    api.post('/register', userRule, (req, res, next) => authController.register(req, res, next));

    // // Version
    const versionsRouter = Router();
    versionsRouter.post('/check', authenticateToken, (req, res, next) => versionController.isVersionExists(req, res, next));
    versionsRouter.post('/', authenticateToken, (req, res, next) => versionController.saveNewVersion(req, res, next));
    versionsRouter.put('/', authenticateToken, (req, res, next) => versionController.editVersion(req, res, next));
    versionsRouter.post('/upload', authenticateToken, upload.array('files'), (req, res, next) => versionController.uploadVersion(req, res, next));
    versionsRouter.post('/execute', [authenticateToken, processVersionRule], (req, res, next) => versionController.executeVersion(req, res, next));
    api.use('/versions', versionsRouter);
    // // Process
    const processRouter = Router();
    processRouter.post('/paging-process', [authenticateToken, pagingRule], (req, res, next) => processController.pagingProcess(req, res, next));
    processRouter.post('/:processName/paging-version', [authenticateToken, pagingRule], (req, res, next) => processController.pagingVersion(req, res, next));
    processRouter.get('/:processName/versions/:versionName', authenticateToken, (req, res, next) => processController.getVersionOfProcess(req, res, next));
    processRouter.get('/:processName/latest-version', authenticateToken, (req, res, next) => processController.getLatestVersion(req, res, next));
    processRouter.get('/:processName/is-exists', authenticateToken, (req, res, next) => processController.isProcessExists(req, res, next));
    api.use('/processes', processRouter);
    // // user
    const userRouter = Router();
    userRouter.post('/paging-user', [authenticateToken, pagingRule], (req, res, next) => userController.pagingUser(req, res, next));
    userRouter.post('/reset-password', [authenticateToken, checkRole([RolesEnums.ADMIN])], (req, res, next) => userController.resetPassword(req, res, next));
    userRouter.post('/update-user', [authenticateToken, checkRole([RolesEnums.ADMIN])], (req, res, next) => userController.updateUser(req, res, next));
    userRouter.post('/change-password', authenticateToken, (req, res, next) => userController.changePassword(req, res, next));
    api.use('/user', userRouter);


    // // Health check route
    api.get('/health-check',  (req, res) => {
        console.log("hello")
         Helper.updateExcelInputValue("/usr/src/storage/example_process1.xlsx", [
            {name: 'a', value: 999},
            {name: 'b', value: 9999},
            {name: 'c', value: 999},
            {name: 'd', value: 99999},
        ]);
        console.log("hello1")
    });

    // // Test auth
    api.get('/test-auth', authenticateToken, (req, res) => {
        res.status(HttpStatus.OK).json(new HttpResponse(req.user, 'OK'));
    });


    // Another middlewares
    // // Error handling middleware
    api.use((err, req, res, next) => {
        // need to log error
        if (err.stack){
            console.error(err.stack);
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    });

    return Router().use('/api', api);
}