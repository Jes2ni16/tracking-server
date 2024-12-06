const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence for auto-incrementing fields

// Define the schema for the document model
const documentSchema = mongoose.Schema({
    // Field for storing the document filename
    filename: {
        type: String,
        required: [true, "Please provide a name"] // Required field with custom error message
    },
    // Field for storing the document status, default is 'Draft'
    status: {
        type: String,
        default: 'Draft'
    },
    // Field for storing the document's purpose
    purpose: {
        type: String,
        required: [true, "Please provide a name"] // Required field with custom error message
    },
  
    // Field for storing the course associated with the document
    course: {
        type: String,
        required: [true, "Please provide a course"] // Required field with custom error message
    },

    // Field for storing the number of copies, default is '1'
    copies: {
        type: String,
        default: '1'
    },
    // Reference to the user who created the document
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // Reference to the 'User' model
    },
    // Field for storing a tracking number, auto-incremented
    trackingNumber: {
        type: Number,
        default: 0
    },
    // Array to store file metadata (original name, MIME type, size, file path)
    files: [{ 
        originalName: String,
        mimeType: String,
        size: Number,
        filePath: String
    }],
    // Array to track the status history of the document (status, updatedBy, timestamp)
    statusHistory: [{
        status: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // Reference to the 'User' model
        },
        timestamp: {
            type: Date,
            default: Date.now // Automatically set to the current date/time
        }
    }]
},
{
    timestamps: true // Automatically add `createdAt` and `updatedAt` fields
});

// Apply the auto-increment plugin to the trackingNumber field
documentSchema.plugin(AutoIncrement, { inc_field: 'trackingNumber' });

module.exports = mongoose.model("Document", documentSchema); // Export the Document model
