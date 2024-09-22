const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Wrapper to handle async errors in Express middleware
const { promisify } = require('util'); // Utility to convert callback-based functions into promise-based ones

// Convert jwt.verify to return a promise using promisify
const verifyToken = promisify(jwt.verify);

// Middleware to validate JWT token
const validateToken = asyncHandler(async (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'User is not authorized, no token provided' });
    }

    // Extract the token from the 'Bearer' scheme (Bearer <token>)
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token with the secret key
        const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Store the decoded user information in the request object for use in the next middleware
        req.user = decoded.user;

        next(); // Token is valid, proceed to the next middleware
    } catch (error) {
        console.error('Token verification failed:', error.message); // Log the error
        res.status(401).json({ message: 'Invalid token or authentication failed' }); // Respond with 401 for invalid token
    }
});

module.exports = validateToken; // Export the middleware for use in other parts of the application
