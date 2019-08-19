'use strict'
//----------------------------------------------------------------------------------Imports
const async = require('async');
const connection = require('../db/connection');
const crypto = require('crypto');
//const jwt = require('../services/authenticateAdmin');
const moment = require('moment');
const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
//const rand = require('generate-key');

process.env.SECRET = 'SmartDelivery_Key';

//----------------------------------------------------------------------------------Upload config 
const multer = require('multer');
var profileImage;
var headerImage;
var ext;
var imgPath;
//var today = moment().format('DD-MM-YYYY')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '././public/uploads');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(20, function (err, raw) {
            ext = file.mimetype.split('/');
            if (err) return cb(err);
            //imgPath = today + "-" +raw.toString('hex') + '.' + ext[1];
            imgPath = raw.toString('hex') + '.' + ext[1];
            if (file.fieldname == 'profileImage') {
                profileImage = imgPath
            } else {
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
function home(req, res) {
    res.send('Home :D');
}

function login(req, res, next) {
    //TypeUsers: Admin, Driver, Restaurant
    var appData = {};
    //var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var cryptPass;
    var typeUser;
    var id;
    if (username && password) {
        if (connection) {
            connection.query(`CALL searchUsername(${connection.escape(username)})`, (err, rows) => {
                if (!err) {
                    if (rows[0].length > 0) {
                        rows[0].forEach((row) => {
                            cryptPass = row.password;
                            typeUser = row.typeUser;
                            username = row.username;
                            id = row.id;
                        });
                        if (bcrypt.compareSync(password, cryptPass)) {
                            var payload = {
                                id: id,
                                typeUser: typeUser,
                                username: username,
                                iat: moment().unix()
                                //email: email,              
                                //fullName: rows[0].fullName,                            
                                //exp: moment(1, 'minute').unix()
                            };
                            var token = jwt.encode(payload, process.env.SECRET);
                            appData['success'] = "Successful";
                            appData['token'] = token;
                            appData['typeUser'] = typeUser;
                            res.status(200).json(appData);
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Username and Password does not match";
                            res.status(202).json(appData);
                            console.log(appData)
                        }
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Username does not exists";
                        res.status(400).json(appData);
                        console.log(appData)
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
            console.log(appData)
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Enter the necessary data";
        res.status(400).json(appData);
        console.log(appData);
    }

}

function forgottenPassword(req, res) {
    var appData = {};
    var email = req.body.email;
    var today = Date.now();
    var code;
    var username;
    async.waterfall([
        function (done) {
            if (connection) {
                connection.query(`CALL searchEmail(${connection.escape(email)})`, (err, rows) => {
                    if (!err) {
                        if (rows.length != undefined) {
                            rows[0].forEach((row) => {
                                username = row.username
                            })
                            done(err, username)
                        } else {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Email does not exists";
                            res.status(202).json(appData);
                            console.log(appData)
                        }
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData)
                    }
                })
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Internal server error"
                res.status(500).json(appData);
                console.log(appData)
            }
        },
        function (user, done) {
            crypto.pseudoRandomBytes(3, function (err, buffer) {
                code = buffer.toString('hex');
                //code = code.toUpperCase();
                //code = rand.generateKey(6)
                done(err, code, user)
            })
        },
        function (code, username, done) {
            code = code
            if (connection) {
                connection.query(`CALL updateCode(${connection.escape(code)},${connection.escape(today)},${connection.escape(email)})`, (err) => {
                    if (!err) {
                        done(err, code, username)
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData)
                    }
                })
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Internal server error";
                res.status(500).json(appData);
                console.log(appData)
            }
        },
        function (code, username, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'helloutask@gmail.com',
                    pass: 'contactoutask'
                }
            });
            var mailOptions = {
                from: 'helloutask@gmail.com',
                to: email,
                subject: 'Reset your password!',
                text: 'Reset your password \n\n'
                    + 'Your reset code is:' + code + '\n\n'
                    + 'For username:' + username + '\n\n'
                    + 'If you did not request this, please ignore this email.'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (!err) {
                    appData['success'] = "Successful";
                    appData['data'] = 'The email was sent succefully!';
                    appData['username'] = username
                    appData['code'] = code
                    res.status(200).json(appData)
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = 'The email was not sent!';
                    res.status(500).json(appData)
                    console.log(appData)
                }
            })
        }
    ])
}

function ensureCode(req, res) {
    var appData = {};
    var codeLife = 1200000;
    var code_created;
    var code = req.body.code;
    var email = req.body.email;
    var today = Date.now();
    if (connection) {
        connection.query(`CALL searchCode(${connection.escape(code)}, ${connection.escape(email)})`, (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    rows[0].forEach((row) => {
                        code_created = row.code_created;
                    });
                    if (code_created && code_created > (today - codeLife)) {
                        req.session.code = code;
                        appData['success'] = "Successful";
                        appData['data'] = "Code is valid";
                        res.status(200).json(appData);
                    } else {
                        if (!email) {
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "Email do not received";
                            res.status(400).json(appData);
                            console.log(appData)
                        } else {
                            connection.query(`CALL deleteCode(${connection.escape(code)})`, (err) => {
                                if (err) {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "Error Ocurred, " + err;
                                    res.status(400).json(appData);
                                    console.log(appData)
                                } else {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "Code has expired";
                                    res.status(400).json(appData);
                                    console.log(appData)
                                }
                            })
                        }
                    }
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = "Code does not exist";
                    res.status(400).json(appData);
                    console.log(appData)
                }
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Error Ocurred, " + err;
                res.status(400).json(appData);
                console.log(appData)
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Internal server error"
        res.status(500).json(appData);
        console.log(appData);
    }
}

function resetPassword(req, res) {
    var appData = {};
    var newPassword = req.body.newPassword;
    var email = req.body.email;
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(newPassword, salt);
    if (req.session.code) {
        if (newPassword.length >= 6) {
            if (connection) {
                connection.query(`CALL updatePassword(${connection.escape(password)}, ${connection.escape(email)})`, (err) => {
                    if (!err) {
                        appData['success'] = "Successful";
                        appData['data'] = "The password has been updated correctly"
                        res.status(200).json(appData);
                        req.session.code = null;
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
            appData['data'] = "Password is too short"
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Forbidden";
        res.status(403).json(appData);
        console.log(appData);
    }

}

function getUserData(req, res) {
    var appData = {};
    var username = req.user.username;
    var typeUser = req.user.typeUser;
    if (connection) {
        switch (typeUser) {
            case "Admin":
                connection.query(`SELECT fullName, email, profileImage, headerImage FROM AdminUsers WHERE username = ${connection.escape(username)}`, (err, rows) => {
                    if (!err) {
                        //appData['userData'] = rows;
                        //appData['typeUser'] = typeUser;
                        res.status(200).json(rows[0]);
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                })
                break;
            case "Driver":
                connection.query(`SELECT fullName, email, idCar, brand, vehicleType, model, color, profileImage, headerImage FROM DriverUsers WHERE username = ${connection.escape(username)}`, (err, rows) => {
                    if (!err) {
                        //appData['userData'] = rows;
                        //appData['typeUser'] = typeUser;
                        res.status(200).json(rows[0]);
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                })
                break;
            case "Restaurant":
                connection.query(`SELECT fullName, email, profileImage, headerImage FROM RestaurantUsers WHERE username  = ${connection.escape(username)}`, (err, rows) => {
                    if (!err) {
                        //appData['userData'] = rows;
                        //appData['typeUser'] = typeUser;
                        res.status(200).json(rows[0]);
                    } else {
                        appData['success'] = "Unsuccessful";
                        appData['data'] = "Error Ocurred, " + err;
                        res.status(400).json(appData);
                        console.log(appData);
                    }
                })
                break;
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Internal server error";
        res.status(500).json(appData);
        console.log(appData);
    }
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    home,
    login,
    forgottenPassword,
    ensureCode,
    resetPassword,
    getUserData
}