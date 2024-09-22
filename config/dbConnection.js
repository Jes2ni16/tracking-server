const mongoose = require('mongoose');

// Function to connect to MongoDB database
const connectDB = async() => {
    try {
        // Attempt to connect to the database using the connection string from environment variables
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        
        // Log success message if connection is successful
        console.log("database connected");
    } catch (err) {
        // Log the error if connection fails
        console.log(err);
        
        // Exit the process with failure status if unable to connect
        process.exit(1);
    }
}

module.exports = connectDB; // Export the connectDB function for use in other parts of the application
