/**
 * Created by EDO on 4/12/2016.
 */
"use strict";
(function(Schema) {
    var UserSchema = new Schema({
        "_id": Number,
        "firstName": String,
        "lastName": String,
        "username": String,
        "password": String,
        "roles": [String]
    });
    return UserSchema;
})();