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
        cb(null, './src/uploads/restaurantUser');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(20, function (err, raw) {
            ext = file.mimetype.split('/');
            if (err) return cb(err);
            //imgPath = today + "-" +raw.toString('hex') + '.' + ext[1];
            imgPath = raw.toString('hex') + '.' + ext[1];
            if (file.fieldname == 'profileImage') {
                profileImage = imgPath;
            } else if (file.fieldname == 'headerImage') {
                headerImage = imgPath;
            }
            cb(null, imgPath);
        });
    }
}),
    fileFilter = (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
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
function registerRestaurantUser(req, res) {
    var appData = {};
    var restaurantUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt)
        //Restaurants_idRestaurant: req.body.idRestaurant
    };
    var verifyPassword = req.body.password;
    if (req.user.typeUser == "Admin") {
        if (restaurantUserData.fullName && restaurantUserData.email && restaurantUserData.username && restaurantUserData.password) {
            if (verifyPassword.length >= 6) {
                if (connection) {
                    connection.query(`CALL searchUsers(${connection.escape(restaurantUserData.username)},${(connection.escape(restaurantUserData.email))})`, (err, rows) => {
                        if (!err) {
                            if (rows.length == undefined) {
                                if (rows.length != 0) {
                                    connection.query('INSERT INTO RestaurantUsers SET ?', restaurantUserData, (err) => {
                                        if (!err) {
                                            appData['success'] = "Successful";
                                            appData['data'] = "Restaurant registered";
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
                                    appData['data'] = "Invalid key idRestaurant";
                                    res.status(400).json(appData);
                                    console.log(appData);
                                }

                                //Revisa si el idRestaurant existe
                                /*connection.query(`SELECT * FROM Restaurants WHERE Restaurants_idRestaurant = ${connection.escape(restaurantUserData.Restaurants_idRestaurant)}`, (err, rows) => {
                                    if (!err) {
                                        ----------------------------------------
                                    } else {
                                        appData['success'] = "Unsuccessful";
                                        appData['data'] = "Error Ocurred, " + err;
                                        res.status(400).json(appData);
                                        console.log(appData);
                                    }
                                })*/
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
        appData['success'] = "Unsuccesful";
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

function updateRestaurantUser(req, res) {
    var appData = {};
    var restaurantUserData = {
        username: req.user.username,
        fullName: req.body.fullName,
        email: req.body.email,
    };
    var updateRestaurant = `
        UPDATE RestaurantUsers SET
        fullName = ${connection.escape(restaurantUserData.fullName)},
        email = ${connection.escape(restaurantUserData.email)},
        WHERE
        username = ${connection.escape(restaurantUserData.username)}
    `;
    if (req.user.typeUser == "Restaurant") {
        if (restaurantUserData.fullName && restaurantUserData.email) {
            if (connection) {
                connection.query(`SELECT * FROM RestaurantUsers WHERE email = ${connection.escape(restaurantUserData.email)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length > 0) {
                            if (rows[0].username == restaurantUserData.username) {
                                connection.query(updateRestaurant, (err) => {
                                    if (!err) {
                                        appData['success'] = "Successful";
                                        appData['data'] = "Restaurant updated";
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
                            connection.query(`CALL searchEmail(${connection.escape(restaurantUserData.email)})`, (err, rows) => {
                                if (!err) {
                                    //if (rows[0].length == undefined) {
                                    if (rows[0] == undefined) {
                                        connection.query(updateRestaurant, (err) => {
                                            if (!err) {
                                                appData['success'] = "Successful";
                                                appData['data'] = "Restaurant updated";
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
                                        appData['data'] = "Email is already registered";
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
            appData['data'] = "Enter the necessary data";
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Restaurant'";
        res.status(404).json(appData);
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
    if (req.user.typeUser == "Restaurant") {
        if (newPassword) {
            if (newPassword.length >= 6) {
                if (connection) {
                    connection.query(`SELECT password FROM RestaurantUsers WHERE username = ${connection.escape(username)}`, (err, rows) => {
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
                            connection.query(`UPDATE RestaurantUsers SET password = ${connection.escape(password)} WHERE username = ${connection.escape(username)}`, (err) => {
                                if (!err) {
                                    appData['success'] = "Success";
                                    appData['data'] = "The password (Restaurant) has been updated";
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
        appData['data'] = "Only users 'Restaurant'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

function uploadRestaurantUserImage(req, res) {
    var appData = {};
    var username = req.user.username;
    var error;
    if (req.user.typeUser == "Restaurant") {
        upload(req, res, (err) => {
            if (!err) {
                if (profileImage || headerImage) {
                    if (connection) {
                        if (profileImage) {
                            connection.query(`UPDATE RestaurantUsers SET profileImage = ${connection.escape(profileImage)} WHERE username = ${connection.escape(username)}`, (err) => {
                                if (!err) {
                                    error = false;
                                } else {
                                    error = true;
                                }
                            })
                        }
                        if (headerImage) {
                            connection.query(`UPDATE RestaurantUsers SET headerImage = ${connection.escape(headerImage)} WHERE username = ${connection.escape(username)}`, (err) => {
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
                            appData['data'] = "Error Ocurred, Image not changed"
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
                appData['data'] = "Error trying to save image, " + err;
                res.status(500).json(appData);
                console.log(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Restaurant'";
        res.status(403).json(appData);
    }

}

function getRestaurantUserImage(req, res) {
    var appData = {};
    var image_file = req.params.imageFile;
    var path_file = "src/uploads/restaurantUser/" + image_file;
    if (req.user.typeUser == "Restaurant") {
        fs.exists(path_file, (exists) => {
            if (exists) {
                res.status(200).sendFile(path.resolve(path_file));
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Image does not exist";
                res.status(400).json(appData);
                console.log(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'RESTAURANT'";
        res.status(403).json(appData);
        console.log(appData);
    }

}

//----------------------------------------------------------------------------------Exports
module.exports = {
    registerRestaurantUser,
    updateRestaurantUser,
    updatePassword,
    uploadRestaurantUserImage,
    getRestaurantUserImage
}