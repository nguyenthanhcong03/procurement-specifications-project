import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate JWT token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 * @description This middleware function checks for the presence of a JWT token in the Authorization header.
 * If the token is present, it verifies the token using the secret key stored in the environment variable `JWT_SECRET`, or a fallback key ('superSecret').
 * If the token is valid, it attaches the decoded user information to the request object and calls the next middleware function.
 * If the token is missing or invalid, it sends a 401 or 403 status response, respectively.
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(
      token, 
      process.env.JWT_SECRET || 'superSecret', 
      (err, user) => {
        if (err) {
          console.log(err);
          return res.sendStatus(403)
        }
  
        req.user = user
        next()
      }
    );
    
}