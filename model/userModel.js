const mongoose = require('mongoose');

// Define the schema for the user model
const userSchema = mongoose.Schema({
    // Field for storing the student's ID number
    student_id: {
        type: String,
        required: [true, "Please provide an ID number"] // Required field with custom error message
    },
    // Field for storing the student's first name
    first_name: {
        type: String,
        required: [true, "Please provide a first name"] // Required field with custom error message
    },
    // Field for storing the student's middle name
    middle_name: {
        type: String,
        required: [true, "Please provide a middle name"] // Required field with custom error message
    },
    // Field for storing the student's last name
    last_name: {
        type: String,
        required: [true, "Please provide a last name"] // Required field with custom error message
    },
    // Field for storing the student's birth date
    birth_date: {
        type: Date, // Define the field type as Date
        required: [true, 'Please provide a birth date'] // Required field with custom error message
    },
    // Field for storing the student's birth place
    birth_place: {
        type: String,
        required: [true, 'Please provide a birth place'] // Required field with custom error message
    },
    // Field for storing the student's sex (gender)
    sex: {
        type: String,
        required: [true, 'Please provide a sex'] // Required field with custom error message
    },
    // Field for storing the student's civil status (e.g., single, married)
    civil_status: {
        type: String,
        required: [true, 'Please provide civil status'] // Required field with custom error message
    },
    // Field for storing the student's citizenship
    citizenship: {
        type: String,
        required: [true, 'Please provide citizenship'] // Required field with custom error message
    },
    // Field for storing the student's religion
    religion: {
        type: String,
        required: [true, 'Please provide religion'] // Required field with custom error message
    },
    // Field for storing the student's address
    address: {
        type: String,
        required: [true, 'Please provide address'] // Required field with custom error message
    },
    // Field for storing the student's contact number
    contact: {
        type: String,
        required: [true, 'Please provide a contact number'] // Required field with custom error message
    },
    // Field for storing the student's email address
    email: {
        type: String,
        required: [true, "Please provide an email address"] // Required field with custom error message
    },
    // Field for storing the student's password
    password: {
        type: String,
        required: [true, "Please provide a password"] // Required field with custom error message
    },
    // Field for storing the user's role (default is 'student')
    role: {
        type: String,
        default: 'student' // Default value if not provided
    }
},
{
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Export the User model for use in other parts of the application
module.exports = mongoose.model("User", userSchema);


