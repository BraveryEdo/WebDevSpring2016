var express = require('express');
var app = express();
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.get('/', function(req, res){
    res.send('Hello Patrick Cincotta');
});
app.listen(port, ipaddress);