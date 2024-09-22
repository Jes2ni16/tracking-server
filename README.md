Project Overview
The Document Tracking System allows users to:
Register and login via JWT authentication.
Upload and manage documents with metadata (e.g., status, tracking number).
Track document status history.
Perform CRUD operations on documents (create, read, update, delete).
Technologies Used
Node.js: JavaScript runtime for the backend.
Express.js: Web framework for creating API routes.
MongoDB: NoSQL database for document storage.
Mongoose: ODM library for MongoDB.
JWT: JSON Web Tokens for authentication.
Multer: Middleware for handling file uploads.
dotenv: For managing environment variables.
root/
│
├── config/
│   ├── dbConnection.js     # MongoDB connection configuration
│   ├── uploadFile.js       # Multer configuration for handling file uploads
│
├── controllers/            # Controllers for handling logic for different routes
│   ├── documentController.js
│   ├── userController.js
│
├── middleware/             # Middleware for authentication and error handling
│   ├── validateToken.js     # JWT validation middleware
│   ├── errorHandler.js      # Global error handler middleware
│
├── models/                 # Mongoose models for database collections
│   ├── Document.js         # Document schema and model
│   ├── User.js             # User schema and model
│
├── routes/                 # API route definitions
│   ├── documentRoutes.js
│   ├── userRoutes.js
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
├── README.md               # Project documentation
└── **index.js**            # Entry point for the server


