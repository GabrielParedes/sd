'use strict'
//----------------------------------------------------------------------------------Imports
const express = require('express');
const restaurantUserController = require('../controllers/restaurantUserController');
const router = express.Router();
const authenticate = require('../middlewares/authenticated');

const moment = require('moment');

//-------------------------------------------------------------------------------------Routes
router.get('/imageRestaurantUser/:imageFile', authenticate.ensureAuth, restaurantUserController.getRestaurantUserImage);

router.post('/registerRestaurantUser', authenticate.ensureAuth, restaurantUserController.registerRestaurantUser);

router.put('/imageRestaurantUser', authenticate.ensureAuth, restaurantUserController.uploadRestaurantUserImage);
router.put('/updateRestaurantUser', authenticate.ensureAuth, restaurantUserController.updateRestaurantUser);
router.put('/updateRestaurantUserPassword', authenticate.ensureAuth, restaurantUserController.updatePassword);

router.post('/text', (req, res) => {
    /*
    var text = req.body.text;
    var regex = /[^a-z0-9ñÑáéíóúÁÉÍÓÚ]/i
    //if (text.indexOf(".") != -1) {

    //var time = moment().format('DD-MM-YYYY HH:mm:ss');
    var time = moment().format('YYYY-MM-DD HH:mm:ss a');
    //console.log(moment("20111031", "YYYYMMDD").fromNow());
    var parts = time.split(' ');
    console.log("Date " + parts[0]);
    console.log("Time " + parts[1]);
    console.log(parts[2]);
    console.log(moment());



    if (regex.test(req.body.text)) {
        res.send('encontrado');
    } else {
        res.send('No encontrado');
    }

    if (moment().isBetween(dateTimeStart, dateTimeEnd)) {
        console.log('Yes');
        console.log('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " SI esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
        res.send('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " NO esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
    } else {
        console.log('No');
        console.log('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " NO esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
        res.send('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " NO esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
    }
    
    */
    //var dateTimeEnd = statusData.endDate + 'T' + statusData.endDate;
    //var dateTimeStart = moment('2018-10-10 14:33:30', 'YYYY-MM-DD HH:mm:ss');
    //var dateTimeEnd = moment('2018-10-15 12:55:43', 'YYYY-MM-DD HH:mm:ss');

    var startDate = req.body.startDate;
    var startTime = req.body.startTime;
    var endDate = req.body.endDate;
    var endTime = req.body.endTime;
    var dateTimeStart = moment(startDate + " " + startTime, 'YYYY-MM-DD HH:mm:ss');
    var dateTimeEnd = moment(endDate + " " + endTime, 'YYYY-MM-DD HH:mm:ss');

    console.log(dateTimeStart.isAfter(dateTimeEnd));
    console.log(moment().isBetween(dateTimeStart, dateTimeEnd))

    if (moment().isBetween(dateTimeStart, dateTimeEnd)) {
        console.log('-SI- esta en tiempo');
    } else {
        console.log('-NO- esta en tiempo');
    }
    console.log('1 ' + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
    var dateRange = dateTimeEnd.add(1, 'days');
    console.log('2 ' + dateRange.format('YYYY-MM-DD HH:mm:ss'))
    if (moment().isBetween(dateTimeStart, dateTimeEnd)) {
        console.log('Yes');
        console.log('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " SI esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
        res.send('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " SI esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
    } else {
        console.log('No');
        console.log('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " NO esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
        res.send('El tiempo ' + moment().format('YYYY-MM-DD HH:mm:ss') + " NO esta entre las " + dateTimeStart.format('YYYY-MM-DD HH:mm:ss') + " y las " + dateTimeEnd.format('YYYY-MM-DD HH:mm:ss'))
    }

})

//----------------------------------------------------------------------------------Export
module.exports = router;