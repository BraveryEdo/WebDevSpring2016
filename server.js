var express       = require('express');
var bodyParser    = require('body-parser');
var multer        = require('multer');
//var passport      = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var cookieParser  = require('cookie-parser');
//var session       = require('express-session');
var mongoose      = require('mongoose');


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// create a default connection string
var connectionString = "mongodb://localhost/webdev";
// use remote connection string
// if running in remote server
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var db = mongoose.connect(connectionString);


var app = module.exports = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(multer());
    //app.use(passport.initialize());
    //app.use(passport.session());
    //app.use(cookieParser());
    //app.use(session({'secret': 'IAteTheLastSamoa', resave: true, saveUninitialized: true}));
    app.use(express.static(__dirname + '/public'));
    app.listen(port, ipaddress);

require("./public/assignment/server/app.js")(app, db, mongoose);



