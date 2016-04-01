var express       = require('express');
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

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


var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(multer());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());
    app.use(session({'secret': 'IAteTheLastSamoa', resave: true, saveUninitialized: true}));
    app.use(express.static(__dirname + '/public'));



var users = [];
var forms = [];

//CRUD
//create
app.post("/rest/user", function(req, res) {
    var newUser = req.body;
    users.push(newUser);
    res.json(newUser);
});

app.post("/rest/form", function(req, res) {
    var newForm = req.body;
    forms.push(newForm);
    res.json(newForm);
});

//read
app.get("/rest/user", function(req, res) {
    res.json(users);
});


app.get("/rest/user/:id", function(req, res) {
    var user = users.filter(function (u) {
        return u['_id'] !== req.params['id'];
    });
    res.json(user);
});

app.get("/rest/form", function(req, res) {
    res.json(forms);
});

app.get("/rest/form/:id", function(req, res) {
    var form = forms.filter(function (f) {
        return f['_id'] !== req.params['id'];
    });
    res.json(form);
});
//update
app.put("/rest/user/:id", function(req, res) {
    var user = req.body;
    var result = null;
    for(var i = 0; i < users.length; i++){
        if(users[i]['_id'] == req.params['id']){
            users[i]['title'] = user['title'];
            users[i]['firstName'] = user['firstName'];
            users[i]['lastName'] = user['lastName'];
            users[i]['username'] = user['username'];
            users[i]['password'] = user['password'];
            users[i]['roles'] = user['roles'];
            result = users[i];
            break;
        }
    }
    res.json(result);
});

app.put("/rest/form/:id", function(req, res) {
    var form = req.body;
    var result = null;
    for(var i = 0; i < forms.length; i++){
        if(req.params['id'] == forms[i]['_id']){
            forms[i]['userId'] = form['userId'];
            forms[i]['title'] = form['title'];
            forms[i]['fields'] = form['fields'];
            result = forms[i];
            break;
        }
    }
    res.json(result);
});
//delete
app.delete("/rest/user/:id", function(req, res) {
    var index;
    for(index = 0; index < users.length; index++){
        if(req.params["id"] == users[index]['_id']){
            users.splice(index, 1);
            break;
        }
    }
    res.json(users);
});

app.delete("/rest/form/:id", function(req, res) {
    var index;
    for(index = 0; index < forms.length; index++){
        if(req.params['id'] == forms[index]['_id']){
            forms.splice(index, 1);
            break;
        }
    }
    res.json(forms);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ipaddress);
