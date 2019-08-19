'use strict'
//----------------------------------------------------------------------------------Imports
const connection = require('../db/connection');

//----------------------------------------------------------------------------------Functions
/*
    STATUS ORDER
    Picked up,
    On it's way,
    Delivered,
    Delayed,
    On time,
    Cancelled,
    Sin estado
*/
function addOrder(req, res) {
    /*
    SELECT du.fullName, 
    du.username, du.idCar, 
    du.brand, 
    du.vehicleType, 
    du.model, du.color, 
    ds.startTime, ds.endTime, 
    ds.status, ds.authorization 
    FROM driverUsers du 
    INNER JOIN driverStatus ds 
    ON du.idDriverUser = ds.DriverUsers_idDriverUser 
    WHERE ds.status = "Waiting"
    */
    //connection.query(`SELECT * FROM driverUsers INNER JOIN driverStatus ON driverUsers.idDriverUser = driverStatus.DriverUsers_idDriverUser WHERE driverStatus.status != ""`, (err, rows) => {
    var appData = {};
    var username = req.user.username;
    var orderData = {
        numOrder: req.body.numOrder,
        phoneNumber: req.body.phoneNumber,
        deliveryAddress: req.body.deliveryAddress,
        askFor: req.body.askFor,
        status: req.body.orderStatus,
        Restaurants_idRestaurant: req.body.idRestaurant,
        DriverUsers_idDriverUser: req.body.idDriverUser
    };

    if (connection) {



        
        connection.query(`SELECT * FROM RestaurantUsers WHERE username = ${connection.escape(username)}`, (err, rows) => {
            if (!err) {










                area = rows[0].area;
                var searchDriver = `SELECT
                    du.fullName,
                    du.username,
                    ds.startTime,
                    ds.endTime,
                    ds.status,
                    ds.authorization
                    FROM driverUsers du
                    INNER JOIN driverStatus ds ON du.idDriverUser = ds.DriverUsers_idDriverUser
                    WHERE ds.status == "Waiting"
                    OR ds.status == "Parked"
                    AND ds.authorization == "YES"
                    AND du.area = ${connection.escape(area)}`;
                connection.query(searchDriver, (err, rows) => {
                    if (!err) {
                        if (rows.length > 0) {

                            var sendDriver = `
                                UPDATE Orders SET
                                numOrder = ${connection.escape(orderData.numOrder)},
                                phoneNumber = ${connection.escape(orderData.phoneNumber)},
                                deliveryAddress = ${connection.escape(orderData.deliveryAddress)},
                                askFor = ${connection.escape(orderData.askFor)},
                                status = ${connection.escape(orderData.status)},
                                idDriverUser
                            `

                            appData['success'] = "Successful";
                            appData['data'] = "The order was sent";
                            res.status(200).json(appData);
                            console.log(appData);
                        } else {
                            //Enviar la orden, sin estado
                            //La orden se almacena de igual manera a diferencia que no tiene estado y tampoco driver
                            //Notificar al administrador que no hay drivers disponibles en la zona
                            appData['success'] = "Unsuccessful";
                            appData['data'] = "There are not drivers";
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
                appData['data'] = "Error Ocurred, " + err;
                res.status(400).json(appData);
                console.log(appData);
            }
        })

        connection.query(`INSERT INTO Orders SET ?`, orderData, (err, rows) => {
            if (!err) {
                appData['success'] = "Successful";
                appData['data'] = "Order added successfully";
                res.status(200).json(appData);
            } else {
                appData['success'] = "Unsuccessful";
                appData['data'] = "Error Ocurred, " + err;
                res.status(400).json(appData);
            }
        })
    } else {
        appData['success'] = "Unsuccessful";
        appData['data'] = "Internal server error";
        res.status(500).json(appData);
    }
}

function addOrderAdmin(req, res){
    var appData = {};
    /*
    numDrivers
    sendSameAddress

    orderNumber
    nameDriver/idDriver
    RestaurantName/idRestaurant
    branchName
    branchAddress
    deliveryAddress
    deliveryPhone

    -----
    askFor
    */
}

function editOrderAdmin(req,res){
    var appData = {};
    /* 
    orderNumber
    nameDriver/idDriver
    restaurantName/idRestaurant
    restaurantAddress
    deliveryAddress
    askFor
    */
}

//Agregar horarios y ordenes

function cancelOrder(req, res) {
    var appData = {};
    var cancelOrder = `
    UPDATE orders SET
    status = ${connection.escape(req.body.orderStatus)}
    WHERE
    idOrder = ${connection.escape(req.params.idOrder)}
 `

    if (connection) {
        connection.query(cancelOrder, (err) => {
            if (!err) {
                appData['success'] = "Successful";
                appData['data'] = "The order was canceled"
                res.status(200).json(appData);
                console.log(appData);
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
    }
}

//----------------------------------------------------------------------------------Exports
module.exports = {
    addOrder,
    cancelOrder
}