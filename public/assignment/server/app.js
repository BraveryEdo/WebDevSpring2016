/**
 * Created by EDO on 3/24/2016.
 */
"use strict";
module.exports = function (app, db, mongoose) {
    // pass db and mongoose reference to model
    var userModel = require("./models/user.model.server.js")(db, mongoose);
    var formModel = require("./models/form.model.server.js")(db, mongoose);
    //console.log(userModel, formModel);
    var uss = require("./services/user.service.server.js")(app, userModel);
    var fss = require("./services/forms.service.server.js")(app, formModel);
    //console.log(uss, fss);

};
