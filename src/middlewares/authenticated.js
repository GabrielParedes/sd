'use strict'
const jwt = require('jwt-simple');
//const moment = require('moment');

process.env.SECRET = 'SmartDelivery_Key'

exports.ensureAuth = function (req, res, next) {
    var appData = {};
    if (!req.headers.authorization) {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Missing authentication header";
        console.log(appData);
        return res.status(403).json(appData);
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, process.env.SECRET);
    } catch (ex) {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Invalid token";
        console.log(appData);
        return res.status(403).json(appData);
    }
    req.user = payload;
    next();
}