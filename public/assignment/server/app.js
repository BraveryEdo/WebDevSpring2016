/**
 * Created by EDO on 3/24/2016.
 */
"use strict";

//var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function (app, db, mongoose, passport) {
    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require('bcrypt-nodejs');
    // pass db and mongoose reference to model
    var userModel = require("./models/user.model.server.js")(db, mongoose);
    var formModel = require("./models/form.model.server.js")(db, mongoose);
    //console.log(userModel, formModel);
    var uss = require("./services/user.service.server.js")(app, userModel, LocalStrategy, bcrypt, passport);
    var fss = require("./services/forms.service.server.js")(app, formModel);
    var fiss = require("./services/field.service.server.js")(app, formModel);
    //console.log(uss, fss);

};
