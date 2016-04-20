/**
 * Created by EDO on 4/12/2016.
 */
module.exports = function(mongoose) {
    var UserSchema = new mongoose.Schema({
        "_id": {type: Number, unique: true},
        "firstName": String,
        "lastName": String,
        "username": {type: String, unique: true, lowercase: true},
        "password": String,
        "roles": [String],
        "email": String,
        "google":   {
            "_id":    String,
            "token": String
        },
        "facebook":   {
            "_id":    String,
            "token": String
        }
    },{collection: "User"});
    return UserSchema;
};