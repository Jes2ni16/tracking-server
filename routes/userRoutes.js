const express = require('express');
const validateToken = require('../middleware/validateTokenHandlers');

const {getUsers , getUser ,updateUser , deleteUser, registerUser, loginUser, currentUser } = require('../controllers/userController');



const router = express.Router();



router.get('/',validateToken, getUsers);          // GET all users
router.get('/:id',validateToken, getUser);        // GET a specific user
router.put('/:id',validateToken, updateUser);     // UPDATE a specific user
router.delete('/:id', validateToken, deleteUser);  // DELETE a specific user
router.post('/register', registerUser);  // POST - Register a new user
router.post('/login', loginUser);        // POST - Login user and get JWT token
// router.get('/current/asas', , currentUser);

// GET - Get current user profile (protected by JWT)


module.exports = router;