/**
 * Created by EDO on 4/12/2016.
 */
module.exports = function(mongoose, FS) {
    var q = require('q');

    var FormSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "title": String,
        "userId": String,
        "fields": [FS],
        "created": Date,
        "updated": {type: Date, default: Date.now}
    }, {collection: "Form"});


    return FormSchema;
};