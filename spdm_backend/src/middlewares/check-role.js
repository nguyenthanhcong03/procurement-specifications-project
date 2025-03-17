/**
 * Middleware to check if a user has one of the required roles.
 * 
 * This middleware verifies whether the authenticated user has a role that matches 
 * one of the allowed roles for the route. If the user's role is not in the list of 
 * permitted roles, it responds with a 403 Forbidden error. Otherwise, it allows the 
 * request to proceed.
 * 
 * @param {string[]} allowedRoles - An array of allowed roles.
 * @returns {Function} Express middleware function.
 */
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
};
