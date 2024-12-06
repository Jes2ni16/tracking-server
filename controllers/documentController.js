// Import required modules
const asyncHandler = require('express-async-handler'); // Handles async/await errors
const Document = require('../model/documentModel'); // Import the Document model
const path = require('path'); // Node.js module for handling file paths
const fs = require('fs'); // Node.js module for file system operations

// Define the path for the uploads directory
const uploadsPath = path.join(__dirname, '../uploads/');

// Function to get all documents for admin or user's documents based on their role
const getDocuments = asyncHandler(async (req, res) => {
    console.log('User:', req.user); // Log the current user's info (useful for debugging)

    // If the user is an admin, fetch all documents
    if (req.user.role === 'admin') {
        const documents = await Document.find(); // Get all documents
        res.status(200).json(documents); // Return documents in response
    } else {
        // If the user is not an admin, fetch only documents created by this user
        const documents = await Document.find({ createdBy: req.user.id });
        res.status(200).json(documents); // Return user's documents
    }
});

// Function to get a specific document by ID
const getDocument = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the document ID from URL parameters

    if (req.user.role === 'admin') {
        // Admin can access any document
        const document = await getDocumentById(id); // Get document by ID
        if (!document) {
            res.status(404).json({ message: 'Document not found' }); // Document not found
            return;
        }
        res.json(document); // Send document in response
    } else {
        // Regular users can only access their own documents
        const documents = await Document.find({ createdBy: req.user.id });
        if (documents.length === 0) {
            res.status(404).json({ message: 'No documents found for this user' });
            return;
        }
        // Check if the requested document belongs to the user
        const document = documents.find(doc => doc._id.toString() === id);
        if (!document) {
            res.status(404).json({ message: 'Document not found for this user' });
            return;
        }
        res.status(200).json(document); // Return the user's document
    }
});

// Helper function to get a document by its ID and map file paths to URLs
async function getDocumentById(id) {
    try {
        const document = await Document.findById(id).exec(); // Fetch document by ID
        if (!document) {
            throw new Error('Document not found');
        }

        // Map file paths to URLs (assuming files are served from the /uploads directory)
        const files = document.files.map(file => ({
            ...file,
            filePath: `/uploads/${path.basename(file.filePath)}` // Serve file from /uploads
        }));

        return {
            ...document.toObject(),
            files // Return document with updated file paths
        };
    } catch (error) {
        console.error('Error fetching document:', error); // Log errors
        throw error;
    }
}

// Function to update an existing document
const updateDocument = asyncHandler(async (req, res) => {
    // Fetch the document by ID
    const document = await Document.findById(req.params.id);
    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    if (req.user.role !== 'admin' && document.createdBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('User does not have permission to update this document');
    }

    let updateData = req.body;

    if (req.body.status && req.body.status !== document.status) {
        if (req.body.status === 'realasing') {
            updateData = {
                ...req.body,
                releaseDate: new Date().toISOString().split('T')[0], // Set the release date to the current date (YYYY-MM-DD)
                $push: {
                    statusHistory: {
                        status: req.body.status,
                        updatedBy: req.user.id, // Track who updated the status
                        timestamp: new Date() // Add a timestamp
                    }
                }
            };
        } else {
            // Otherwise, update the status without setting a release date
            updateData = {
                ...req.body,
                $push: {
                    statusHistory: {
                        status: req.body.status,
                        updatedBy: req.user.id, // Track who updated the status
                        timestamp: new Date() // Add a timestamp
                    }
                }
            };
        }
    }

    // Update the document in the database
    const updatedDocument = await Document.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedDocument) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Respond with the updated document
    res.status(200).json(updatedDocument);
});


// Function to create a new document
const createDocument = async (req, res) => {
    try {
        // Extract fields from the request body
        const { filename, purpose,  course, copies } = req.body;

        // Check if all required fields are provided
        if (!filename || !purpose   || !course ||  !copies) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Ensure files are uploaded
        if (!req.files) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        // Validate the number of files
        const files = req.files.map(file => ({
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            filePath: file.path, // Save file path for future retrieval
        }));

        if (files.length < 1 || files.length > 3) {
            return res.status(400).json({ message: 'You must upload between 1 and 3 files' });
        }

        // Create a new document in the database
        const document = await Document.create({
            filename,
            purpose,
            createdBy: req.user.id, // Link the document to the current user
            course,
            copies,
            files, // Save all file information
        });

        // Respond with the created document
        res.status(201).json(document);
    } catch (error) {
        console.error('Error creating document:', error); // Log errors
        res.status(500).json({ message: 'An error occurred while creating the document' });
    }
};

// Function to view a document by its tracking number
const viewDocument = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber; // Extract tracking number from request

        if (!trackingNumber) {
            return res.status(400).json({ error: 'Tracking number is required' });
        }

        // Find the document by tracking number
        const document = await Document.findOne({ trackingNumber });

        if (document) {
            // Return document details and status
            return res.status(200).json({ trackingNumber: document.trackingNumber, filename: document.filename, status: document.status });
        } else {
            return res.status(404).json({ error: 'Document not found' });
        }
    } catch (error) {
        console.error(error); // Log unexpected errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to view uploaded images
const viewImage = async (req, res) => {
    fs.readdir(uploadsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read directory' });
        }

        // Respond with a list of file names
        res.json(files);
    });
};

const deleteDocument = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ensure the ID exists
      const deletedItem = await Document.findByIdAndDelete(id);
  
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found." });
      }
  
      res.status(200).json({ message: "Item deleted successfully." });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

// Export the functions to be used in other parts of the application
module.exports = { updateDocument, getDocument, getDocuments, createDocument, viewDocument, viewImage , deleteDocument};
