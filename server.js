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

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1:27017/cs5610spring2016_patcinc'
var db = mongoose.connect(connectionString);

require("./public/assignment/server/app.js")(app, db, mongoose);



