/**
 * Created by EDO on 4/19/2016.
 */
"use strict";
module.exports = function (db, mongoose){
    var q = require('q');

    var CueSchema = require('/./cue.schema.server.js')(mongoose);
    var CueModel = mongoose.model("Track", CueSchema);
    var TrackSchema = require('./track.schema.server.js')(mongoose, CueSchema);
    var TrackModel = mongoose.model("Track", TrackSchema);

    var api = {
        getTrack: getTrack
    };
    return api;

    function getTrack(tid) {
        var deferred = q.defer();
        TrackModel.getTrack(tid, function(err, res){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });
        return deferred.promise;
    }

};
