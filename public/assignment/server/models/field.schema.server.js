/**
 * Created by EDO on 4/12/2016.
 */
module.exports = function(mongoose) {
    var FieldSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "type": String,
        "title": String,
        "text": String,
        "options": [{"_id": Number, "text": String}],
        "addOption": Boolean
    });

    return FieldSchema;
};