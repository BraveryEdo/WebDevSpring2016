/**
 * Created by EDO on 3/24/2016.
 */
"use strict";

define(function(require, exports, module) {
    module.exports = function (app, db, mongoose, passport, LocalStrategy) {

        require("./models/user.model.js")(mongoose),
            require("./models/form.model.js")(mongoose),
            require("./services/user.service.server.js")(app, db, passport, LocalStrategy, userModel),
            require("./services/form.service.server.js")(app, db, formModel)

    };
});