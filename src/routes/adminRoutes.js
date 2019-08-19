'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

//-------------------------------------------------------------------------------------Routes
router.get('/imageAdmin/:imageFile', authenticate.ensureAuth,adminController.getAdminImage);

router.post('/registerAdmin', authenticate.ensureAuth, adminController.registerAdmin);

router.put('/imageAdmin', authenticate.ensureAuth, adminController.uploadAdminImage);
router.put('/updateAdmin', authenticate.ensureAuth, adminController.updateAdmin);
router.put('/updateAdminPassword', authenticate.ensureAuth, adminController.updatePassword);


router.get('/order', (req, res) => {
    //Concatenar objetos
    var orderData = {
        numOrder: 1,
        phoneNumber: "12354678",
        deliveryAddress: "Guatemala",
        askFor: "Gabriel"
    };
    console.log(orderData);
    var con = {idDriverUser: 1}

    var mod = Object.assign({}, orderData, con)
    console.log(mod);

    var mod2 = orderData.concat
    res.status(200).json(mod)
})
    
//----------------------------------------------------------------------------------Export
module.exports = router;
    
    
