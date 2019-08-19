'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const statusController = require('../controllers/statusController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//----------------------------------------------------------------------------------Routes
router.post('/sendStatus', authenticate.ensureAuth, statusController.sendStatus);
router.put('/authorizateStatus/:idStatus', authenticate.ensureAuth, statusController.authorizateStatus);

//----------------------------------------------------------------------------------Export
module.exports = router;