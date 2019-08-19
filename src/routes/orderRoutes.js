'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//----------------------------------------------------------------------------------Routes
router.post('/testOrder', orderController.addOrder);

//----------------------------------------------------------------------------------Export
module.exports = router;