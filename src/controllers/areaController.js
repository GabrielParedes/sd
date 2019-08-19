'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');

//----------------------------------------------------------------------------------Functions
function addArea(req, res) {
    var appData = {};
    var areaData = {
        name: req.body.name,
        description: req.body.description
    }
    if (areaData.name && areaData.description) {
        if (connection) {
            connection.query(`SELECT * FROM Areas WHERE name = ${connection.escape(areaData.name)}`, (err, rows) => {
                if (!err) {
                    if (rows.length == 0) {
                        connection.query(`INSERT INTO Areas SET ?`, areaData, (err) => {
                            if (!err) {
                                appData['success'] = "Successful";
                                appData['data'] = "Area registered";
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
                        appData['data'] = "Area already exist";
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

function getAreas(req, res) {
    var appData = {};
    if (connection) {
        connection.query(`SELECT idArea, name FROM Areas ORDER BY name ASC`, (err, rows) => {
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

function updateArea(req, res) {
    var appData = {};
    var areaData = {
        idArea: req.params.idArea,
        name: req.body.name,
        description: req.body.description
    };
    var updateArea = `
        UPDATE Areas SET
        name = ${connection.escape(areaData.name)},
        description = ${connection.escape(areaData.description)}
        WHERE
        idArea = ${connection.escape(areaData.idArea)}
    `;
    if (areaData.idArea) {
        if (areaData.idArea && areaData.name && areaData.description) {
            if (connection) {
                connection.query(`SELECT * FROM Areas WHERE name = ${connection.escape(areaData.name)}`, (err, rows) => {
                    if (!err) {
                        if (rows.length == 0) {
                            connection.query(updateArea, (err) => {
                                if (!err) {
                                    appData['success'] = "Successful";
                                    appData['data'] = "Area updated";
                                    res.status(200).json(appData);
                                } else {
                                    appData['success'] = "Unsuccessful";
                                    appData['data'] = "Error Ocurred, " + err;
                                    res.status(400).json(appData);
                                    console.log(appData);
                                }
                            })
                        } else {
                            appData['success'] = "Unsucessful";
                            appData['data'] = "Area already exist";
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
        appData['data'] = "Necessary param 'idArea";
        res.status(400).json(appData);
        console.log(appData);
    }
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    addArea,
    getAreas,
    updateArea
}