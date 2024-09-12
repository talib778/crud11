import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
let secretKey = process.env.JWT_SECRET;
export const authentication = (req, res, next) => {
    try {
        let token;

        // Check if token is in the authorization header
        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            const tokenParts = authHeader.split(' ');

            // Check if token is in two parts
            if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
                token = tokenParts[1];
            } else {
                return res.status(401).send({ message: "Invalid token format" });
            }
        } else if (req.query.token) {  // Check if token is in the query parameters
            token = req.query.token;
        } else {
            return res.status(403).send({ message: 'Access forbidden, no token provided' });
        }

        // Verify the token
        jwt.verify(token, secretKey, (error, user) => {
            if (error) {
                return res.status(401).json('Invalid token');
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || req.user.role !== requiredRole) {
            return res.status(403).send({ message: 'Access forbidden, permissions denied' });
        }
        next();
    };
};