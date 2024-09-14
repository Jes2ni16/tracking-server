const express = require('express');
const upload = require('../config/uploadFile')


const  { updateDocument, getDocument, getDocuments, createDocument } = require('../controllers/documentController');
const validateToken = require('../middleware/validateTokenHandlers');




const router = express.Router();

router.use(validateToken)
router.get('/',getDocuments);          
router.get('/:id', getDocument); 
router.patch('/:id', updateDocument ); 
router.post('/', upload.any(), createDocument ); 

module.exports = router;