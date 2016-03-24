var express = require('express');
var fs = require('fs');

var app = express();
    app.use(express.static(__dirname + '/public'));

//CRUD
//create
//read
    app.get("/rest/user", function(req, res){
        res.send([
            {"_id": 123, "firstName": "Alice",         "lastName": "Wonderland",        "username": "alice",         "password": "alice"},
            {"_id": 234, "firstName": "Bob",        "lastName": "Hope",                 "username": "bob",         "password": "bob"},
            {"_id": 345, "firstName": "Charlie","lastName": "Brown",                 "username": "charlie", "password": "charlie"},
            {"_id": 456, "firstName": "Dan",        "lastName": "Craig",                 "username": "dan",         "password": "dan"},
            {"_id": 567, "firstName": "Edward","lastName": "Norton",                "username": "ed",        "password": "ed"}
        ]);});

    app.get("/rest/form", function(req, res){
        res.send([
            {"_id": "000", "title": "Contacts", "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "alice", "text": "555-555-5555", "addOption": false}]},
            {"_id": "010", "title": "ToDo",     "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "go shopping", "text": "before friday's party"},{"_id": 1, "type": "Text", "title": "finish writing paper", "text": "continue with chapter 3 research", "addOption": false}]},
            {"_id": "020", "title": "CDs",      "userId": 234, "fields": [{"_id": 0, "type": "Text", "title": "Pink Floyd", "text": "The Dark Side of the Moon"}, {"_id": 1, "type": "Text", "title": "Pendulum", "text": "Hold Your Colour", "addOption": false}]}]);});
//update
//delete

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ipaddress);






