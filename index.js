const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection')
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');
connectDB();
const app = express();


const port = process.env.PORT || 3001 ;

app.use(cors({
    origin: `https://philsca-doc-tracker.vercel.app/`,
    methods: ['GET', 'POST', 'PUT', 'PATCH' ,'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use('/api/users/',require('./routes/userRoutes'))
app.use('/api/documents/',require('./routes/documentRoutes'))
app.use('/api/view/',require('./routes/viewRoutes'))

app.use(errorHandler)


app.listen(port , ()=> {
    console.log(`Running on PORT ${port}`)
})