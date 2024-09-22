// Importing necessary tools and libraries
const asyncHandler = require('express-async-handler'); // To handle errors in async functions easily
const User = require('../model/userModel'); // User model to interact with the user data in the database
const bcrypt = require('bcrypt'); // To securely encrypt passwords
const jwt = require('jsonwebtoken'); // To create and verify secure tokens for users

// Function to get a list of all users
// When an admin requests, they can see all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find(); // Retrieve all users from the database
    res.status(200).json(users); // Send back the list of users
});

// Function to get a specific user by their ID
// If an admin is making the request, they see all users
// A normal user only sees their own profile
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Look up the user by their ID

    if (!user) { // If no user is found with that ID
        res.status(404); // Send a "not found" error
        throw new Error("User not found");
    }

    if (req.user.role === 'admin') {
        const allUsers = await User.find(); // Admins can view all users
        res.status(200).json(allUsers); // Send the list of users
    } else {
        res.status(200).json(user); // Regular users only see their own info
    }
});

// Function to update user information
// This is used when a user or admin needs to change their profile information
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Find the user by ID

    if (!user) { // If no user is found
        res.status(404); // Send a "not found" error
        throw new Error("User not found");
    }

    // Update the user’s information and send the updated profile back
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body, // The new information to be updated
        { new: true } // Return the updated data
    );

    res.status(201).json(updatedUser); // Send the updated user info
});

// Function to delete a user
// This is used by admins to remove a user account
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id); // Find and delete the user

    if (!user) { // If no user is found with that ID
        res.status(404); // Send a "not found" error
        throw new Error("User not found");
    }

    await user.remove(); // Delete the user from the system
    res.status(200).json(user); // Confirm the deletion
});

// Function for a new user to register or sign up
const registerUser = asyncHandler(async (req, res, next) => {
    // Collect all the details provided by the user during sign-up
    const { student_id, first_name, middle_name, last_name, birth_date, birth_place, 
        sex, civil_status, citizenship, religion, address, contact, email, password } = req.body;

    // Basic validation to check if important fields are filled in
    if (!email || !password) {
        res.status(400).json({ error: "All fields are required" }); // If missing, send an error message
        return; // Stop the function if fields are missing
    }

    // Check if the email is already registered in the system
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(409).json({ error: "User already registered" }); // If the user exists, show an error
        return; // Stop the function
    }

    // Securely encrypt the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the given details
    const user = await User.create({
        student_id, first_name, middle_name, last_name, birth_date, birth_place, 
        sex, civil_status, citizenship, religion, address, contact,
        email,
        password: hashedPassword // Save the encrypted password
    });

    // If the user is successfully created, send back their info
    if (user) {
        res.status(201).json({
            id: user.id,
            email: user.email
        });
    } else {
        res.status(400).json({
            error: "User data is not valid" // If there's an error, show this message
        });
    }
});

// Function for logging a user into the system
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Collect login credentials

    // Check if both fields are filled in
    if (!email || !password) {
        res.status(400); // If not, show an error
        throw new Error('All fields are required');
    }

    // Look up the user by their email
    const user = await User.findOne({ email });

    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Create a secure token for the user to access the system
        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    role: user.role // Include the user's role (admin or regular)
                }
            },
            process.env.ACCESS_TOKEN_SECRET, // Use a secret key to secure the token
            { expiresIn: '100m' } // The token will expire in 100 minutes
        );

        // Send the token and user info back to the client
        res.status(200).json({
            accessToken,
            user: {
                name: user.name,
                email: user.email,
                id: user.id,
                role: user.role
            }
        });
    } else {
        res.status(401); // If the email or password is wrong, show an error
        throw new Error('Invalid email or password');
    }
});

// Function to get the current logged-in user's information
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user); // Send back the currently logged-in user's info
});

// Export all functions to be used in other parts of the application
module.exports = { getUsers, getUser, updateUser, deleteUser, registerUser, loginUser, currentUser };
