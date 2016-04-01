/**
 * Created by EDO on 3/24/2016.
 */
"use strict";

module.exports = function(app, db, mongoose, passport, LocalStrategy){

    var userModel = require("./models/user.model.js")(mongoose);
    var formModel = require("./models/form.model.js")(mongoose);

    require("./services/user.service.server.js")(app, db, mongoose, passport, LocalStrategy, userModel);
    require("./services/form.service.server.js")(app, db, mongoose, passport, LocalStrategy, formModel);

};
