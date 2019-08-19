'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//----------------------------------------------------------------------------------Routes
router.get('/imageRestaurant/:imageFile', authenticate.ensureAuth, restaurantController.getRestaurantImage);
router.get('/restaurants', authenticate.ensureAuth, restaurantController.getRestaurants);

router.post('/registerRestaurant', authenticate.ensureAuth, restaurantController.registerRestaurant);

router.put('/imageRestaurant/:idRestaurant', authenticate.ensureAuth, restaurantController.uploadRestaurantImage);
router.put('/updateRestaurant/:idRestaurant', authenticate.ensureAuth, restaurantController.updateRestaurant);

//----------------------------------------------------------------------------------Export
module.exports = router;