'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//----------------------------------------------------------------------------------Routes
router.get('/getFullNames', messageController.getFullNames);

//----------------------------------------------------------------------------------Export
module.exports = router;