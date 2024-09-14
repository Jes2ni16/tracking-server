const asyncHandler = require('express-async-handler');
const User = require('../model/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//get all Users
//GET /api/users/
const getUsers = asyncHandler(async (req, res) => {
    const users= await User.find()
    res.status(200).json(users);
})



//getUser
//GET /api/users/:id
const getUser =asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User not found")
    }
if(req.user.role === 'admin'){
    const allUsers = await User.find();
    res.status(200).json(allUsers);
}else{
    res.status(200).json(user);
}
})

//update user
//PUT /api/contact/:id
const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User not found")
    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    
    res.status(201).json(updatedUser);
})




//delete User
//delete /api/contact/:id
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User not found")
    }
    await user.remove();
    res.status(200).json(user);
})

const registerUser = asyncHandler(async (req, res, next) => {
    const { student_id, first_name, middle_name, last_name, birth_date, birth_place, 
        sex, civil_status, citizenship, religion, address, contact, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further code execution
    }

    // Check if user already exists
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(409).json({ error: "User already registered" });
        return; // Prevent further code execution
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        student_id, first_name, middle_name, last_name, birth_date, birth_place, 
        sex, civil_status, citizenship, religion, address, contact,
        email,
        password: hashedPassword
    });

    // Response based on user creation success
    if (user) {
        res.status(201).json({
            id: user.id,
            email: user.email
        });
    } else {
        res.status(400).json({
            error: "User data is not valid"
        });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate access token
        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    role: user.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '100m' }
        );

        // Send token and user info
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
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})





module.exports = { getUsers  , getUser , updateUser , deleteUser , registerUser, loginUser, currentUser }