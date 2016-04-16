/**
 * Created by EDO on 4/12/2016.
 */
"use strict";

(function(Schema, FieldSchema) {
    var FormSchema = new Schema({
        "_id": Number,
        "title": String,
        "userId": String,
        "fields": [FieldSchema],
        "created": Date,
        "updated": Date
    });
    return FormSchema;
})();