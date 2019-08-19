'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const areaController = require('../controllers/areaController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//----------------------------------------------------------------------------------Routes
router.get('/areas', authenticate.ensureAuth, areaController.getAreas);

router.post('/registerArea', authenticate.ensureAuth, areaController.addArea);

router.put('/updateArea', authenticate.ensureAuth, areaController.updateArea)
//----------------------------------------------------------------------------------Export
module.exports = router;