/**
 * Created by EDO on 4/12/2016.
 */
"use strict";

module.exports = function(mongoose) {

    var FieldSchema = require('./field.schema.server.js')(mongoose);
    var FormSchema = new mongoose.Schema({
        "_id": Number,
        "title": String,
        "userId": String,
        "fields": [FieldSchema],
        "created": Date,
        "updated": {type: Date, default: Date.now}
    }, {collection: "form"});
    return FormSchema;
};