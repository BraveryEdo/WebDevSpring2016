/**
 * Created by EDO on 4/12/2016.
 */
"use strict";
module.exports = function(mongoose) {

    var UserSchema = new mongoose.Schema({
        "_id": Number,
        "firstName": String,
        "lastName": String,
        "username": String,
        "password": String,
        "roles": [String]
    },{collection: "user"});
    return UserSchema;
};