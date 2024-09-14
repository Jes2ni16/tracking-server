const asyncHandler = require('express-async-handler');
const Document = require('../model/documentModel');
const path = require('path');

const getDocuments = asyncHandler(async (req, res) => {
    console.log('User:', req.user); 
    if(req.user.role === 'admin'){
        const documents = await Document.find()
        res.status(200).json(documents);
    }else{
        const documents = await Document.find({createdBy: req.user.id})
        res.status(200).json(documents);
    }
})




const getDocument = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract the ID from URL parameters

    if (req.user.role === 'admin') {
  
        const document = await getDocumentById(id);
        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
     
    res.json(document);
    } else {
        // Regular users can only find documents they created
        const documents = await Document.find({ createdBy: req.user.id });
        if (documents.length === 0) {
            res.status(404).json({ message: 'No documents found for this user' });
            return;
        }
        // Check if the specific document exists in the user's documents
        const document = documents.find(doc => doc._id.toString() === id);
        if (!document) {
            res.status(404).json({ message: 'Document not found for this user' });
            return;
        }
        res.status(200).json(document);
    }
});


async function getDocumentById(id) {
    try {
      const document = await Document.findById(id).exec();
      if (!document) {
        throw new Error('Document not found');
      }
  
      // Map file paths to URLs served by Express (assuming files are served from /uploads)
      const files = document.files.map(file => ({
        ...file,
        filePath: `/uploads/${path.basename(file.filePath)}`
      }));
  
      return {
        ...document.toObject(),
        files
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

const updateDocument = asyncHandler(async (req, res) => {
    // Retrieve the document by ID
    const document = await Document.findById(req.params.id);
    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }

    // Check user permissions (change this later for admin privileges)
    if (req.user.role !== 'admin' && document.createdBy.toString() !== req.user.id) {
        res.status(403);
        throw new Error('User does not have permission to update this document');
    }

    // Prepare status history update if status is being changed
    let updateData = req.body;
    if (req.body.status && req.body.status !== document.status) {
        updateData = {
            ...req.body,
            $push: {
                statusHistory: {
                    status: req.body.status,
                    updatedBy: req.user.id,
                    timestamp: new Date()
                }
            }
        };
    }

    // Update the document with new data
    const updatedDocument = await Document.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true } // Ensure that validators are run
    );

    // Send response with updated document
    res.status(200).json(updatedDocument);
});

const createDocument = async (req, res) => {
    try {
      // Destructure fields from request body
      const { filename, purpose, schoolName, lastAttended, course, major, copies } = req.body;
  
      // Validate required fields
      if (!filename || !purpose || !schoolName || !lastAttended || !course || !major || !copies) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }
  
      // Ensure files were uploaded
      if (!req.files) {
        return res.status(400).json({ message: 'No files were uploaded' });
      }
  
      // Check the number of files and validate
      const files = req.files.map(file => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        filePath: file.path,
      }));
  
      if (files.length < 1 || files.length > 3) {
        return res.status(400).json({ message: 'You must upload between 1 and 3 files' });
      }
  
      // Create a new document instance
      const document = await Document.create({
        filename,
        purpose,
        createdBy: req.user.id, // Assuming req.user.id is set by authentication middleware
        schoolName,
        course,
        major,
        lastAttended,
        copies,
        files, // Save all files under a single property
      });
  
      // Respond with success
      res.status(201).json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ message: 'An error occurred while creating the document' });
    }
  };


  const viewDocument = async (req, res) => {
    try {
      // Extract tracking number from request parameters
      const trackingNumber = req.params.trackingNumber;
  
      // Validate input
      if (!trackingNumber) {
        return res.status(400).json({ error: 'Tracking number is required' });
      }
  
      // Fetch document status from MongoDB
      const document = await Document.findOne({ trackingNumber });
  
      // Send response
      if (document) {
        return res.status(200).json({ trackingNumber: document.trackingNumber, filename:document.filename, status: document.status });
      } else {
        return res.status(404).json({ error: 'Document not found' });
      }
    } catch (error) {
      // Handle unexpected errors
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
module.exports = { updateDocument, getDocument, getDocuments, createDocument ,viewDocument}