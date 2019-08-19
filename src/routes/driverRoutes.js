'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//-------------------------------------------------------------------------------------Routes
router.get('/imageDriver/:imageFile', authenticate.ensureAuth, driverController.getDriverImage);
router.get('/drivers', driverController.getDrivers);

router.post('/registerDriver', authenticate.ensureAuth, driverController.registerDriver);

router.put('/imageDriver', authenticate.ensureAuth, driverController.uploadDriverImage);
router.put('/updateDriver', authenticate.ensureAuth, driverController.updateDriver);
router.put('/updateDriverPassword', authenticate.ensureAuth, driverController.updatePassword);

//----------------------------------------------------------------------------------Export
module.exports = router;