const express = require('express');



const  { viewDocument } = require('../controllers/documentController');





const router = express.Router();

router.get('/:trackingNumber',viewDocument);          


module.exports = router;