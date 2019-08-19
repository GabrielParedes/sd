'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');

//----------------------------------------------------------------------------------Upload config
const multer = require('multer');
var logo;
var ext;
var imgPath;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/restaurant');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(20, function (err, raw) {
            ext = file.mimetype.split('/');
            if (err) return cb(err);

            imgPath = raw.toString('hex') + '.' + ext[1];
            logo = imgPath;
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
    }).single('logo');

//----------------------------------------------------------------------------------Functions
function getRestaurants(req, res) {
    var appData = {};

    if (connection) {
        connection.query(`SELECT * FROM Restaurants`, (err, rows) => {
            if (!err) {
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

function getRestaurantsArea(req, res) {
    var appData = {};
    var idRestaurant;
    if (connection) {
        connection.query(`SELECT * FROM Restaurants`, (err, rows) => {
            if (!err) {
                if (rows.length != 0) {
                    connection.query(`SELECT * FROM Restaurants r INNER JOIN Areas a ON r.Areas_idArea = a.idArea`)
                } else {
                    appData['success'] = "Unsuccessful";
                    appData['data'] = "No data";
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
        appData['success'] = "Unsuccessful";
        appData['data'] = "Internal server error";
        res.status(500).json(appData);
        console.log(appData);
    }
}





function registerRestaurant2(req, res) {
    var appData = {};
    var restaurantData = {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        askFor: req.body.askFor,
        Areas_idArea: req.body.idArea
    }

    if (restaurantData.name && restaurantData.description && restaurantData.address && restaurantData.askFor && restaurantData.Areas_idArea) {
        if (connection) {
            connection.query(searchName, (err, rows) => {
                if (!err) {
                    if (rows.length == 0) {
                        connection.query(searchArea, (err, rows) => {
                            if (!err) {
                                if (rows.length != 0) {
                                    connection.query(insertRestaurant, restaurantData, (err) => {
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
                                    appData['data'] = "Invalid key 'idArea'";
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
                        appData['data'] = "The restaurant already exist";
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
        appData['data'] = "Enter the necessary data";
        res.status(400).json(appData);
        console.log(appData);
    }
}

function registerRestaurant(req, res) {
    var appData = {};
    var restaurantData = {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        askFor: req.body.askFor,
        Areas_idArea: req.body.idArea
    };
    //Verifica los campos
    if (restaurantData.name && restaurantData.description && restaurantData.address && restaurantData.askFor && restaurantData.Areas_idArea) {
        if (connection) {
            //Busca si el restaurante y area existe
            connection.query(`SELECT * FROM Restaurants r INNER JOIN Areas a ON r.Areas_idArea = a.idArea WHERE r.name = ${connection.escape(restaurantData.name)} AND a.idArea = ${connection.escape(restaurantData.Areas_idArea)}`, (err, rows) => { })




            
            connection.query(`SELECT * FROM Restaurants r INNER JOIN Areas a ON r.Areas_idArea = a.idArea WHERE r.name = ${connection.escape(restaurantData.name)} AND a.idArea = ${connection.escape(restaurantData.Areas_idArea)}`, (err, rows) => {
                if (!err) {
                    if (rows.length == 0) {
                        //Busca si es valido el idArea
                        connection.query(`SELECT * FROM Areas WHERE idArea = ${connection.escape(restaurantData.Areas_idArea)}`, (err, rows) => {
                            if (!err) {
                                if (rows.length != 0) {
                                    //Inserta un Restaurante
                                    connection.query(`INSERT INTO Restaurants SET ?`, restaurantData, (err) => {
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
                                    appData['data'] = "Invalid key 'idArea'";
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
                        appData['data'] = "The restaurant already exist";
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
        appData['data'] = "Enter the necessary data";
        res.status(400).json(appData);
        console.log(appData);
    }
}

function updateRestaurant(req, res) {
    var appData = {};
    var restaurantData = {
        idRestaurant: req.params.idRestaurant,
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        askFor: req.body.askFor,
        Areas_idArea: req.body.idArea
    }

    var updateRestaurant = `
        UPDATE Restaurants SET
        name = ${connection.escape(restaurantData.name)},
        description = ${connection.escape(restaurantData.description)},
        address = ${connection.escape(restaurantData.address)},
        askFor = ${connection.escape(restaurantData.askFor)},
        Areas_idArea = ${connection.escape(restaurantData.Areas_idArea)}
        WHERE
        idRestaurant = ${connection.escape(restaurantData.idRestaurant)}
    `
    if (restaurantData.idRestaurant) {
        if (restaurantData.name && restaurantData.description && restaurantData.address && restaurantData.askFor && restaurantData.Areas_idArea) {
            if (connection) {
                connection.query(`SELECT * FROM Restaurants WHERE name = ${connection.escape(restaurantData.name)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length == 0) {
                            connection.query(`SELECT * FROM Areas WHERE idArea = ${connection.escape(restaurantData.Areas_idArea)}`, (err, rows) => {
                                if (!err) {
                                    if (rows.length != 0) {
                                        connection.query(updateRestaurant, (err) => {
                                            if (!err) {
                                                appData['success'] = "Successful";
                                                appData['data'] = "Restaurant Updated";
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
                                        appData['data'] = "Invalid key 'idArea'";
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
                            appData['data'] = "Name Restaurant already exist";
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
            appData['data'] = "Enter the necessary data";
            res.status(400).json(appData);
            console.log(appData);
        }
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Necessary param 'idRestaurant'";
        res.status(400).json(appData);
        console.log(appData);
    }

}

function uploadRestaurantImage(req, res) {
    var appData = {};
    var idRestaurant = req.params.idRestaurant;
    if (idRestaurant) {
        upload(req, res, (err) => {
            if (!err) {
                if (logo) {
                    if (connection) {
                        connection.query(`UPDATE Restaurants SET logo = ${connection.escape(logo)} WHERE idRestaurant = ${connection.escape(idRestaurant)}`, (err) => {
                            if (!err) {
                                appData['success'] = "Successful";
                                appData['data'] = "Image changed";
                                appData['logo'] = logo;
                                res.status(200).json(appData);
                            } else {
                                appData['success'] = "Unsuccessful";
                                appData['data'] = "Error Ocurred, Image not changed";
                                res.status(400).json(appData);
                                console.log(appData);
                            }
                            logo = undefined;
                        })
                    } else {
                        appData['success'] = "Unsuccesful";
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
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Error trying to save image, " + err;
                res.status(500).json(appData);
                console.log(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Necessary param 'idRestaurant";
        res.status(400).json(appData);
        console.log(appData);
    }
}

function getRestaurantImage(req, res) {
    var appData = {};
    var image_file = req.params.imageFile;
    var path_file = "src/uploads/restaurant/" + image_file;

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
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    getRestaurants,
    registerRestaurant,
    uploadRestaurantImage,
    getRestaurantImage,
    updateRestaurant
}