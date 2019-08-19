'use stict'
//----------------------------------------------------------------------------------Imports
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'pLSspzIL',
    database: 'SmartDeliveryDB'
})

module.exports = connection