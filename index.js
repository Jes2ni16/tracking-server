// Importing the necessary modules
const express = require('express'); // Express framework for building the server
const errorHandler = require('./middleware/errorHandler'); // Custom error handling middleware
const connectDB = require('./config/dbConnection'); // Function to connect to the MongoDB database
const cors = require('cors'); // Middleware to allow cross-origin requests
const dotenv = require('dotenv').config(); // To load environment variables from the .env file
const path = require('path'); // Utility for working with file paths

// Connect to the MongoDB database
connectDB();

const app = express(); // Initialize the Express application

// Set the port from the environment variable or default to 3001
const port = process.env.PORT || 3001;

// Enable Cross-Origin Resource Sharing (CORS)
// This allows the frontend (at the specified URL) to communicate with this server
app.use(cors({
    origin: `https://philsca-doc-tracker.vercel.app`, // URL of the frontend application
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers in requests
}));

// Serve static files from the 'uploads' directory
// This is where uploaded files (like documents) will be stored and accessed
app.use('/uploads', express.static('uploads'));

// Parse incoming JSON data in requests
app.use(express.json());

// Define routes for the application
app.use('/api/users/', require('./routes/userRoutes')); // Routes related to user operations (login, registration, etc.)
app.use('/api/documents/', require('./routes/documentRoutes')); // Routes for handling document operations (uploading, tracking, etc.)
app.use('/api/view/', require('./routes/viewRoutes')); // Routes for viewing document status and other information

// Use a custom error handling middleware
// This will catch and handle errors globally throughout the app
app.use(errorHandler);

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Running on PORT ${port}`); // Log the port number where the server is running
});
