var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(multer());

var users = [
    {        "_id":123, "firstName":"Alice",            "lastName":"Wonderland",
        "username":"alice",  "password":"alice",   "roles": ["student"]                },
    {        "_id":234, "firstName":"Bob",              "lastName":"Hope",
        "username":"bob",    "password":"bob",     "roles": ["admin"]                },
    {        "_id":345, "firstName":"Charlie",          "lastName":"Brown",
        "username":"charlie","password":"charlie", "roles": ["faculty"]                },
    {        "_id":456, "firstName":"Dan",              "lastName":"Craig",
        "username":"dan",    "password":"dan",     "roles": ["faculty", "admin"]},
    {        "_id":567, "firstName":"Edward",           "lastName":"Norton",
        "username":"ed",     "password":"ed",      "roles": ["student"]                }
];

var forms = [
    {"_id": 000, "title": "Contacts", "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "alice", "text": "555-555-5555", "addOption": false}]},
    {"_id": 010, "title": "ToDo",     "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "go shopping", "text": "before friday's party"},{"_id": 1, "type": "Text", "title": "finish writing paper", "text": "continue with chapter 3 research", "addOption": false}]},
    {"_id": 020, "title": "CDs",      "userId": 234, "fields": [{"_id": 0, "type": "Text", "title": "Pink Floyd", "text": "The Dark Side of the Moon"}, {"_id": 1, "type": "Text", "title": "Pendulum", "text": "Hold Your Colour", "addOption": false}]}
];

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






