'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const userController = require('../controllers/usersController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//-------------------------------------------------------------------------------------Routes
router.get('/getUserData', authenticate.ensureAuth, userController.getUserData);
router.get('/', userController.home);

router.post('/login', userController.login);
router.post('/forgottenPassword', userController.forgottenPassword);
router.post('/ensureCode', userController.ensureCode);

router.post('/resetPassword', userController.resetPassword);

//----------------------------------------------------------------------------------Export
module.exports = router;