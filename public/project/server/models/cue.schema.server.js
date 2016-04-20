/**
 * Created by EDO on 4/19/2016.
 */
module.exports = function(mongoose) {
    var CueSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "time": Number,
        "trig": Number
    });
    return CueSchema;
};