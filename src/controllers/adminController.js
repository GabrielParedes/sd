'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
//var regex = /[^a-z0-9ñÑáéíóúÁÉÍÓÚ\x20]/i             -----------REGULAR EXPRESIONS-------------
//----------------------------------------------------------------------------------Upload config 
const multer = require('multer');
var profileImage;
var headerImage;
var ext;
var imgPath;
//var today = moment().format('DD-MM-YYYY')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/admin');
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
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    upload = multer({
        storage: storage,
        fileFilter: fileFilter
    }).fields([{ name: 'profileImage' }, { name: 'headerImage' }]);

//----------------------------------------------------------------------------------Functions 
function registerAdmin(req, res) {
    var appData = {};
    var adminData = {
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    };
    var verifyPass = req.body.password;
    if (req.user.typeUser == "Admin") {
        if (adminData.fullName && adminData.username && adminData.email && adminData.password) {
            if (verifyPass.length >= 6) {
                if (connection) {
                    connection.query(`CALL searchUsers(${connection.escape(adminData.username)},${(connection.escape(adminData.email))})`, (err, rows) => {
                        if (!err) {
                            if (rows.length == undefined) {
                                connection.query('INSERT INTO AdminUsers SET ?', adminData, (err, rows) => {
                                    if (!err) {
                                        appData['success'] = "Successful";
                                        appData['data'] = "Admin registered";
                                        res.status(200).json(appData);
                                    } else {
                                        appData['success'] = "Unsuccessful";
                                        appData['data'] = "Error Ocurred" + err;
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
                appData['data'] = "Send de necessary data"
                res.status(400).json(appData);
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
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }

}

function updateAdmin(req, res) {
    var appData = {};
    var adminData = {
        username: req.user.username,
        fullName: req.body.fullName,
        email: req.body.email
    };
    var updateAdmin = `
        UPDATE AdminUsers SET
        fullName = ${connection.escape(adminData.fullName)},
        email = ${connection.escape(adminData.email)}
        WHERE
        username = ${connection.escape(adminData.username)}
    `;
    if (req.user.typeUser == "Admin") {
        if (adminData.username && adminData.fullName && adminData.email) {
            if (connection) {
                connection.query(`SELECT * FROM AdminUsers WHERE email = ${connection.escape(adminData.email)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length > 0) {
                            if (rows[0].username == adminData.username) {
                                connection.query(updateAdmin, (err) => {
                                    if (!err) {
                                        appData['success'] = "Successful";
                                        appData['data'] = "Admin updated";
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
                            connection.query(`CALL searchEmail(${(connection.escape(adminData.email))})`, (err, rows) => {
                                if (!err) {
                                    if (rows[0] == undefined) {
                                        connection.query(updateAdmin, (err) => {
                                            if (!err) {
                                                appData['success'] = "Successful";
                                                appData['data'] = "Admin updated";
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
            appData['data'] = "Send the necessary data";
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

function updatePassword(req, res) {
    var appData = {};
    var newPassword = req.body.newPassword;
    var actualPassword = req.body.actualPassword;
    var password = bcrypt.hashSync(newPassword, salt);
    var username = req.user.username;
    var matchPass;
    if (req.user.typeUser == "Admin") {
        if (newPassword) {
            if (newPassword.length >= 6) {
                if (connection) {
                    connection.query(`SELECT password FROM AdminUsers WHERE username = ${connection.escape(username)}`, (err, rows) => {
                        if (!err) {
                            if (rows.length > 0) {
                                if (bcrypt.compareSync(actualPassword, rows[0].password)) {
                                    matchPass = true
                                } else {
                                    matchPass = false
                                }
                            } else {
                                matchPass = false
                            }
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Error Ocurred, " + err;
                            res.status(400).json(appData);
                            console.log(appData);
                        }
                        if (matchPass) {
                            connection.query(`UPDATE AdminUsers SET password = ${connection.escape(password)} WHERE username = ${connection.escape(username)}`, (err) => {
                                if (!err) {
                                    appData['success'] = "Successful";
                                    appData['data'] = "The Password (Admin) has been updated";
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
                appData['data'] = "Password is too short"
                res.status(400).json(appData);
                console.log(appData);
            }
        } else {
            appData['success'] = "Unsuccessful";
            appData['data'] = "Send the necessary data";
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

function uploadAdminImage(req, res) {
    var appData = {};
    var username = req.user.username;
    var error;

    if (req.user.typeUser == "Admin") {
        upload(req, res, (err) => {
            if (!err) {
                if (profileImage || headerImage) {
                    if (connection) {
                        if (profileImage) {
                            connection.query(`UPDATE AdminUsers SET profileImage = ${connection.escape(profileImage)} WHERE username = ${connection.escape(username)}`, (err) => {
                                if (!err) {
                                    error = false;
                                } else {
                                    error = true;
                                }
                            })
                        }
                        if (headerImage) {
                            connection.query(`UPDATE AdminUsers SET headerImage = ${connection.escape(headerImage)} WHERE username = ${connection.escape(usename)}`, (err) => {
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
                appData['data'] = "Error trying to save image" + err;
                res.status(500).json(appData);
                console.log(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

function getAdminImage(req, res) {
    var appData = {};
    var image_file = req.params.imageFile;
    var path_file = "src/uploads/admin/" + image_file;
    if (req.user.typeUser == "Admin") {
        fs.exists(path_file, (exists) => {
            if (exists) {
                res.status(200).sendFile(path.resolve(path_file))
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Image does not exist";
                res.status(400).json(appData);
                console.log(appData);
            }
        });
    } else {
        appData['success'] = 'Unsuccessful';
        appData['data'] = "Only users 'Admin'";
        res.status(403).json(appData);
        console.log(appData);
    }
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    registerAdmin,
    updateAdmin,
    updatePassword,
    uploadAdminImage,
    getAdminImage
}