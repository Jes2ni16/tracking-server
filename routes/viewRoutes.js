const express = require('express');



const  { viewDocument, viewImage } = require('../controllers/documentController');



const router = express.Router();


router.get('/image', viewImage);     
router.get('/:trackingNumber',viewDocument);    
 


module.exports = router;