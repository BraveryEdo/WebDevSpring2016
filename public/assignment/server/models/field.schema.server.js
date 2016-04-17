/**
 * Created by EDO on 4/12/2016.
 */
"use strict";

module.exports = function(mongoose) {

    var FieldSchema = new mongoose.Schema({
            "_id": Number,
            "type": String,
            "options": [{"_id": Number, "text": String}],
            "addOption": Boolean
        });
    return FieldSchema;
};