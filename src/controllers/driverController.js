'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

//----------------------------------------------------------------------------------Upload config 
const multer = require('multer');
var profileImage;
var headerImage;
var ext;
var imgPath;
//var today = moment().format('DD-MM-YYYY')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/driver');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(20, function (err, raw) {
            ext = file.mimetype.split('/');
            if (err) return cb(err);
            //imgPath = today + "-" +raw.toString('hex') + '.' + ext[1];
            imgPath = raw.toString('hex') + '.' + ext[1];
            if (file.fieldname == 'profileImage') {
                profileImage = imgPath
            } else if (file.fieldname == 'headerImage') {
                headerImage = imgPath
            }
            cb(null, imgPath);

        });
    }
}),
    fileFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    upload = multer({
        storage: storage,
        fileFilter: fileFilter
    }).fields([{ name: 'profileImage' }, { name: 'headerImage' }])

//----------------------------------------------------------------------------------Functions
function registerDriver(req, res) {
    var appData = {};
    var verifyPass = req.body.password;
    var driverData = {
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        idCar: req.body.idCar,
        brand: req.body.brand,
        vehicleType: req.body.vehicleType,
        model: req.body.model,
        color: req.body.color,
        Areas_idArea: req.body.Areas_idArea
    };
    if (req.user.typeUser == "Admin") {
        if (driverData.fullName && driverData.username && driverData.email && driverData.password && driverData.idCar && driverData.brand && driverData.vehicleType && driverData.model && driverData.color && driverData.Areas_idArea) {
            if (verifyPass.length >= 6) {
                if (connection) {
                    connection.query(`CALL searchUsers(${connection.escape(driverData.username)},${(connection.escape(driverData.email))})`, (err, rows) => {
                        if (!err) {
                            if (rows.length == undefined) {
                                connection.query('INSERT INTO DriverUsers SET ?', driverData, (err, rows) => {
                                    if (!err) {
                                        appData['success'] = "Successful";
                                        appData['data'] = "Driver registered";
                                        res.status(200).json(appData);
                                    } else {
                                        appData['success'] = "Unsuccessful";
                                        appData['data'] = err;
                                        res.status(400).json(appData);
                                        console.log(appData);
                                    }
                                })
                            } else {
                                appData['success'] = "Unsuccessful";
                                appData['data'] = "Email or username already exist";
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
                    appData['data'] = "Internal server error";
                    res.status(500).json(appData);
                    console.log(appData);
                }
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Password is too short";
                res.status(400).json(appData);
                console.log(appData);
            }
        } else {
            appData['success'] = "Unsuccessful";
            appData['data'] = "Enter the necessary data";
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

function updateDriver(req, res) {
    var appData = {};

    var driverData = {
        username: req.user.username,
        fullName: req.body.fullName,
        email: req.body.email,
        idCar: req.body.idCar,
        brand: req.body.brand,
        vehicleType: req.body.vehicleType,
        model: req.body.model,
        color: req.body.color
    };

    var updateDriver = `
    UPDATE DriverUsers SET
    fullName = ${connection.escape(driverData.fullName)},
    email = ${connection.escape(driverData.email)},
    idCar = ${connection.escape(driverData.idCar)},
    brand = ${connection.escape(driverData.brand)},
    vehicleType = ${connection.escape(driverData.vehicleType)},
    model = ${connection.escape(driverData.model)},
    color = ${connection.escape(driverData.color)}
    WHERE
    username = ${connection.escape(driverData.username)}
    `;
    if (req.user.typeUser == "Driver") {
        if (driverData.username && driverData.fullName && driverData.email && driverData.idCar && driverData.brand && driverData.vehicleType && driverData.model && driverData.color) {
            if (connection) {
                connection.query(`SELECT * FROM DriverUsers WHERE email = ${connection.escape(driverData.email)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length > 0) {
                            if (rows[0].username == driverData.username) {
                                connection.query(updateDriver, (err) => {
                                    if (!err) {
                                        appData['success'] = "Successful";
                                        appData['data'] = "Driver updated";
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
                                appData['data'] = "Email already exist";
                                res.status(400).json(appData);
                                console.log(appData);
                            }
                        } else {
                            connection.query(`CALL searchEmail(${(connection.escape(driverData.email))})`, (err, rows) => {
                                if (!err) {
                                    if (rows[0].length == undefined) {
                                        connection.query(updateDriver, (err) => {
                                            if (!err) {
                                                appData['success'] = "Successful";
                                                appData['data'] = "Driver updated";
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
                                        appData['data'] = "Email already exist";
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
                        }
                    } else {
                        appData['success'] = "Successful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                })
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Internal server error";
                res.status(500).json(appData);
                console.log(appData);
            }
        } else {
            appData['success'] = "Unsuccessfull";
            appData['data'] = "Enter the necessary data";
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Driver'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

function updatePassword(req, res) {
    var appData = {};
    var newPassword = req.body.newPassword;
    var actualPassword = req.body.actualPassword;
    var password = bcrypt.hashSync(newPassword, salt);
    var username = req.user.username;
    var matchPass;

    if (req.user.typeUser == "Driver") {
        if (newPassword) {
            if (newPassword.length >= 6) {
                if (connection) {
                    connection.query(`SELECT password FROM DriverUsers  WHERE username = ${connection.escape(username)}`, (err) => {
                        if (!err) {
                            if (rows.length > 0) {
                                if (bcrypt.compareSync(actualPassword, rows[0].password)) {
                                    matchPass = true;
                                } else {
                                    matchPass = false;
                                }
                            } else {
                                matchPass = false;
                            }
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Error Ocurred, " + err;
                            res.status(400).json(appData);
                            console.log(appData);
                        }
                        if (matchPass) {
                            connection.query(`UPDATE DriverUsers SET password = ${connection.escape(password)} WHERE username = ${connection.escape(username)}`, (err) => {
                                if (!err) {
                                    appData['success'] = "Successful";
                                    appData['data'] = "The Password (Driver) has been updated";
                                    res.status(200).json(appData);
                                } else {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "Error Ocurred, " + err;
                                    res.status(400).json(appData);
                                    console.log(appData);
                                }
                            })
                        } else {
                            appData['success'] = "Unsuccessful",
                                appData['data'] = "Actual password is incorrect";
                            res.status(400).json(appData);
                            console.log(appData);
                        }
                    })
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = "Internal server error";
                    res.status(500).json(appData);
                    console.log(appData);
                }
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Password is too short"
                res.status(400).json(appData);
                console.log(appData);
            }
        } else {
            appData['success'] = "Unsuccessful";
            appData['data'] = "Enter the necessary data";
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Driver'";
        res.status(403).json(appData);
        console.log(appData);
    }


}

function uploadDriverImage(req, res) {
    var appData = {};
    var username = req.user.username;
    var error;
    if (req.user.typeUser == "Driver") {

    } else {

    }
    upload(req, res, (err) => {
        if (!err) {
            if (profileImage || headerImage) {
                if (connection) {
                    if (profileImage) {
                        connection.query(`UPDATE DriverUsers SET profileImage = ${connection.escape(profileImage)} WHERE username = ${connection.escape(username)}`, (err) => {
                            if (!err) {
                                error = false;
                            } else {
                                error = true;
                            }
                        })
                    }
                    if (headerImage) {
                        connection.query(`UPDATE DriverUsers SET headerImage = ${connection.escape(headerImage)} WHERE username = ${connection.escape(username)}`, (err) => {
                            if (!err) {
                                error = false;
                            } else {
                                error = true;
                            }
                        })
                    }
                    if (!error) {
                        appData['success'] = "Successful";
                        appData['data'] = "Image changed";
                        appData['profileImage'] = profileImage;
                        appData['headerImage'] = headerImage;
                        res.status(200).json(appData);
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = "Internal server error";
                    res.status(500).json(appData);
                    console.log(appData);
                }
            } else {
                appData['success'] = "Successful";
                appData['data'] = "No loaded image";
                res.status(200).json(appData);
                console.log(appData);
            }
            profileImage = undefined;
            headerImage = undefined;
        } else {
            appData['success'] = "Unsuccessful";
            appData['data'] = "Error trying to save image";
            res.status(500).json(appData);
            console.log(appData);
        }
    })
}

function getDriverImage(req, res) {
    var image_file = req.params.imageFile;
    var path_file = "src/uploads/driver/" + image_file;

    if (req.user.typeUser == "Driver") {
        fs.exists(path_file, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(path_file))
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Image does not exist";
                res.status(400).json(appData);
            }
        });
    } else {
        applicationCache['success'] = "Successful";
        applicationCache['data'] = "Only user 'Restaurant'";
        res.status(403).json(appData);
        console.log(appData);
    }

}

function getDrivers(req, res) {
    var appData = {};
    var rand;
    //rand = Math.floor(Math.random() * (11 - 1) + 1);
    if (connection) {
        connection.query(`SELECT idDriverUser, fullName FROM DriverUsers ORDER BY fullName DESC`, (err, rows) => {
            if (!err) {
                //appData['data'] = rows;
                res.status(200).json(rows);
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Error Ocurred, " + err;
                res.status(400).json(appData);
                console.log(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Internal server error";
        res.status(500).json(appData);
        console.log(appData);
    }
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    registerDriver,
    updateDriver,
    updatePassword,
    uploadDriverImage,
    getDriverImage,
    getDrivers
}