/**
 * Created by EDO on 4/19/2016.
 */
module.exports = function(mongoose, CueSchema, SC) {
    var TrackSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "title": String,
        "creator": String,
        "length": Number,
        "cues" :[CueSchema]
    },{collection: "Track"});
    return TrackSchema;
};