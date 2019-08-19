'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');
const moment = require('moment');
//----------------------------------------------------------------------------------Functions
function sendMessage(req, res){
    var appData = {};
    var messageData = {
        //idConversation: 
        from: req.user.username,
        to: req.body.to,
        orderNumber: req.body.orderNumber,
        subject: req.body.subject,
        message: req.body.message,
        sendDate: moment().format('DD-MM-YYYY'),
        sendTime: moment().format('HH:mm:ss')
    }

    if(connection){
        //Obtener id/username datos del destinatario (to)
        //Obtener un identificador de la conversacion

        connection.query(`INSERT INTO user_conversations SET ?`, messageData, (err) => {
            if(!err){
                appData['success'] = "Sucessful";
                appData['data'] = "Message send";
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
        appData['data'] = "Internal server error";
        res.status(500).json(appData);
        console.log(appData);
    }
}

function getFullNames(req, res){
    var appData = {};
    var username = req.user.username;

    var listNames = `
        SELECT fullName, username FROM AdminUsers
        WHERE username != ${connection.escape(username)}
        UNION ALL
        SELECT fullName, username FROM DriverUsers
        WHERE username != ${connection.escape(username)}
        UNION ALL
        SELECT fullName, username FROM RestaurantUsers
        WHERE username != ${connection.escape(username)}
        ORDER BY fullName ASC
    `
    if(connection){
        connection.query(listNames, (err, rows) => {
            if(!err){
                console.log(rows)
                if(rows.length > 0){
                    res.status(200).json(rows);
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

//----------------------------------------------------------------------------------Exports
module.exports = {
    getFullNames
}