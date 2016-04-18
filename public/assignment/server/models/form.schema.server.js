/**
 * Created by EDO on 4/12/2016.
 */
module.exports = function(mongoose) {
    var q = require('q');
    var FieldSchema = require('./field.schema.server.js')(mongoose);
    var FieldModel = mongoose.model("Field", FieldSchema);

    var FormSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "title": String,
        "userId": String,
        "fields": [FieldSchema],
        "created": Date,
        "updated": {type: Date, default: Date.now}
    }, {collection: "Form"});

    FormSchema.methods.updateField =  function(fid, f2id, fieldUpdate){
        var deferred = q.defer();
        FieldModel.findOne({'_id': f2id}, function(err, field){
            if(err){
                deferred.reject(err);
            } else {
                field.update(fieldUpdate, function(err){
                    if(err){
                        deferred.reject(err);
                    } else {
                        deferred.resolve(getFormById(fid));
                    }
                });
            }
        });
        return q.promise();
    };

    return FormSchema;
};