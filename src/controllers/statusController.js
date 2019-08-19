'use strict'
const connection = require('../db/connection');
const moment = require('moment');

function sendStatus(req, res) {
    //Aviable, busy, stationary 
    var appData = {};
    var verifyStart;
    var verifyEnd;
    var aviableShift = false;
    var verifyShift;
    if (req.user.typeUser == "Driver") {
        var statusData = {
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endDate: req.body.endDate,
            endTime: req.body.endTime,
            status: req.body.status,
            //authorized: "NO",
            DriverUsers_idDriverUser: req.user.id,
            dateCreated: moment().format('YYYY-MM-DD'),
            timeCreated: moment().format('HH:mm:ss')
            //Restaurant_idRestaurant: req.body.idRestaurant
        };
        if (statusData.startDate && statusData.startTime && statusData.endDate && statusData.endTime && statusData.status && statusData.DriverUsers_idDriverUser) {
            if (connection) {
                connection.query(`SELECT * FROM DriverStatus WHERE DriverUsers_idDriverUser = ${connection.escape(statusData.DriverUsers_idDriverUser)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length > 0) {
                            for (var i = 0, lng = rows.length; i < lng; i++) {
                                console.log(i)
                                verifyStart = (moment(rows[i].startDate).format('YYYY-MM-DD') + ' ' + rows[i].startTime);
                                verifyEnd = (moment(rows[i].endDate).format('YYYY-MM-DD') + ' ' + rows[i].endTime);
                                if (moment().isBetween(moment(verifyStart, 'YYYY-MM-DD HH:mm:ss'), moment(verifyEnd, 'YYYY-MM-DD HH:mm:ss'))) {
                                    aviableShift = false;
                                } else {
                                    aviableShift = true;
                                }
                            }
                        } else {
                            aviableShift = true;
                        }
                        //Registrar Shift
                        if (aviableShift == true) {
                            //Concatenate date and time on format 'YYYY-MM-DD HH:mm:ss'
                            var start = statusData.startDate + ' ' + statusData.startTime;
                            var end = statusData.endDate + ' ' + statusData.endTime;
                            //Assign format dateTime
                            var startDateTime = moment(start, 'YYYY-MM-DD HH:mm:ss');
                            var endDateTime = moment(end, 'YYYY-MM-DD HH:mm:ss');

                            
                            if(moment().isBetween(startDateTime, endDateTime)){
                                verifyShift = false;
                            } else {
                                verifyShift = true;
                            }
                            if (verifyShift) {
                                if (startDateTime.isBefore(endDateTime)) {
                                    var allowDateTime = moment(startDateTime).add(1, 'd').add(1, 'millisecond');

                                    //console.log(moment().isBetween(startDateTime, endDateTime))
                                    //console.log(startDateTime);
                                    //console.log(endDateTime);
                                    //console.log(allowDateTime);
                                    //console.log(" ");
                                    //console.log("Start " + startDateTime);
                                    //console.log("End   " + endDateTime);
                                    //console.log("Allow " + allowDateTime);

                                    if (endDateTime.isBetween(startDateTime, allowDateTime)) {
                                        connection.query(`INSERT INTO DriverStatus SET ?`, statusData, (err, rows) => {
                                            if (!err) {
                                                appData['success'] = "Successful";
                                                appData['data'] = "Status added, and waiting for authorization";
                                                res.status(200).json(appData);
                                            } else {
                                                appData['success'] = "Unsuccessful";
                                                appData['data'] = "Error Ocurred, " + err;
                                                res.status(400).json(appData);
                                                console.log(appData);
                                            }
                                        })
                                    } else {
                                        appData['success'] = "Unsuccessful";
                                        appData['data'] = "TimeEnd is out of range";
                                        res.status(400).json(appData);
                                        console.log(appData);
                                    }
                                } else {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "TimeStart is after TimeEnd";
                                    res.status(400).json(appData);
                                    console.log(appData);
                                }
                            } else {
                                appData['success'] = "Unsuccessful";
                                appData['data'] = "TimeStart is before this moment";
                                res.status(400).json(appData);
                                console.log(appData);
                            }
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "No aviable send shift";
                            res.status(400).json(appData);
                            console.log(appData);
                        }
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                })
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Only users 'Driver'";
                res.status(403).json(appData);
                console.log(appData);
            }
        } else {
            appData['success'] = "Unsuccessful";
            appData['data'] = "Internal server error";
            res.status(500).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Enter the necessary data";
        res.status(400).json(appData);
        console.log(appData);
    }
}

/*
    STATUS DRIVER
    aviable,
    on route,
    waiting,
    stationary,
    busy/occupied

    if(moment().isBetween(startDateTime, endDateTime)){
*/

function authorizateStatus(req, res) {
    var appData = {};

    if (req.user.typeUser == "Admin") {
        var statusData = {
            username: req.user.username,
            authorized: req.body.authorized,
            dateReviewed: moment().format('YYYY-MM-DD'),
            timeReviewed: moment().format('HH:mm:ss'),
            idStatus: req.params.idStatus
        };

        var authorizateStatus = `
        UPDATE DriverStatus SET
        authorized = ${connection.escape(statusData.authorized)},
        reviewedBy = ${connection.escape(statusData.username)},
        dateReviewed = ${connection.escape(statusData.dateReviewed)},
        timeReviewed = ${connection.escape(statusData.timeReviewed)}
        WHERE
        idStatus = ${connection.escape(statusData.idStatus)}
        `;
        if (connection) {
            connection.query(`SELECT * FROM DriverStatus WHERE idStatus = ${connection.escape(statusData.idStatus)}`, (err, rows) => {
                if (!err) {
                    if (rows.length > 0) {
                        console.log(rows[0].status);
                        if (rows[0].reviewedBy == null) {
                            connection.query(authorizateStatus, (err) => {
                                if (!err) {
                                    appData['success'] = "Successful";
                                    appData['data'] = "Status updated";
                                    res.status(200).json(appData);
                                } else {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "Error Ocurred, " + err;
                                    res.status(400).json(appData);
                                    console.log(appData);
                                }
                            })
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Has already been reviewed";
                            res.status(200).json(appData);
                            console.log(appData);
                        }
                    } else {
                        appData['success'] = "Successful";
                        appData['data'] = "Shift not found";
                        res.status(200).json(appData);
                        console.log(appData);
                    }
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = "Error Ocurred, " + err;
                    res.status(400).json(appData);
                    console.log(appData);
                }
            })
        } else {
            appData['success'] = "Unuccessful";
            appData['data'] = "Internal server error";
            res.status(500).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

module.exports = {
    sendStatus,
    authorizateStatus
}