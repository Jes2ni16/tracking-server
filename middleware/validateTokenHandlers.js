const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'User is not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        next(); // Token is valid, proceed to the next middleware
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid token or authentication failed' });
    }
});

module.exports = validateToken;