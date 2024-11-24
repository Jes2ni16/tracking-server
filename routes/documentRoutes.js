const express = require('express');
const upload = require('../config/uploadFile'); // Import file upload middleware configuration

// Import document controller functions
const { updateDocument, getDocument, getDocuments, createDocument , deleteDocument} = require('../controllers/documentController');
const validateToken = require('../middleware/validateTokenHandlers'); // Import middleware to validate authentication token

const router = express.Router(); // Create a new Express router

router.use(validateToken); // Apply token validation middleware to all routes

// GET request to retrieve all documents
router.get('/', getDocuments);          

// GET request to retrieve a specific document by ID
router.get('/:id', getDocument); 

// PATCH request to update a specific document by ID
router.patch('/:id', updateDocument); 

router.delete('/:id', deleteDocument); 

// POST request to create a new document, supports file upload
router.post('/', upload.any(), createDocument); 

module.exports = router; // Export the router for use in other parts of the application
