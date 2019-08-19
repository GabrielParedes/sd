'use  strict'
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next();
});
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'SmartDelivery_Key',
    resave: true,
    saveUninitialized: true
}));

app.set('port', process.env.PORT || 1441);
app.set('host', process.env.HOST || '10.1.1.18')

app.listen(app.get('port'), app.get('host'), () => {
    console.log('Server is running on ' + "http://" + app.get('host') + ":" + app.get('port') );
})

var adminRoutes = require('./routes/adminRoutes');
var areaRoutes = require('./routes/areaRoutes');
var driverRoutes = require('./routes/driverRoutes');
var messageRoutes = require('./routes/messageRoutes');
var orderRoutes = require('./routes/orderRoutes');
var restaurantRoutes = require('./routes/restaurantRoutes');
var restaurantUserRoutes = require('./routes/restaurantUserRoutes');
var statusRoutes = require('./routes/statusRoutes');
var usersRoutes = require('./routes/usersRoutes');

app.use(adminRoutes);
app.use(areaRoutes);
app.use(driverRoutes);
app.use(messageRoutes);
app.use(orderRoutes);
app.use(restaurantRoutes);
app.use(restaurantUserRoutes);
app.use(statusRoutes);
app.use(usersRoutes);