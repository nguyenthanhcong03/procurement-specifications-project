import { body } from "express-validator";

// Validation rules
export const userRule = [
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
    body('role').notEmpty().withMessage('Role is required').isIn(['ADMIN', 'USER']).withMessage('Role must be either ADMIN or USER'),
];

export const userRuleWithoutRole = [
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
];

export const pagingRule = [
    body('pageIndex').optional({ nullable: true }).isInt().withMessage("Page index must be an integer"),
    body('pageSize').optional({ nullable: true }).isInt().withMessage("Page size must be an integer"),
    body('search').optional({ nullable: true }).isString().withMessage("Search must be a string"),
];

export const processVersionRule = [
    body('processName').notEmpty().withMessage('Process name is required').isString().withMessage("Process name must be a string"),
    body('versionName').notEmpty().withMessage('Version name is required').isString().withMessage("Version name must be a string"),
];