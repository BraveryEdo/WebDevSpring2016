/**
 * Created by EDO on 4/12/2016.
 */
"use strict";

(function(Schema) {
    var FieldSchema = new Schema(
        {
            "_id": Number,
            "type": String,
            "options": [{"_id": Number, "text": String}],
            "addOption": Boolean
        });
    return FieldSchema;
})();