const { constants } = require('../constants'); // Import constants for error status codes

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Determine the status code, defaulting to 500 if not set
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    // Switch case to handle different error types based on the status code
    switch (statusCode) {
        // Validation error
        case constants.VALIDATION_ERROR:
            res.status(constants.VALIDATION_ERROR).json({
                title: "Validation Failed", 
                message: err.message, 
                stackTrace: err.stack
            });
            break;
        
        // Not found error
        case constants.NOT_FOUND:
            res.status(constants.NOT_FOUND).json({
                title: "Not Found", 
                message: err.message, 
                stackTrace: err.stack
            });
            break;
        
        // Unauthorized error
        case constants.UNAUTHORIZED:
            res.status(constants.UNAUTHORIZED).json({
                title: "Unauthorized", 
                message: err.message, 
                stackTrace: err.stack
            });
            break;
        
        // Forbidden error
        case constants.FORBIDDEN:
            res.status(constants.FORBIDDEN).json({
                title: "Forbidden", 
                message: err.message, 
                stackTrace: err.stack
            });
            break;
        
        // Server error
        case constants.SERVER_ERROR:
            res.status(constants.SERVER_ERROR).json({
                title: "Server Error", 
                message: err.message, 
                stackTrace: err.stack
            });
            break;
        
        // Default case: no error
        default:
            console.log('No error, all good');
            break;
    }
};

module.exports = errorHandler; // Export the error handler middleware
