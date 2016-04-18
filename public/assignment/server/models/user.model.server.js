/**
 * Created by EDO on 3/23/2016.
 */
"use strict";
module.exports = function (db, mongoose){
    var q = require('q');
    var fs = require('fs');
    var userPath = "public/assignment/server/models/user.mock.json";
    var UserSchema = require('./user.schema.server.js')(mongoose);
    var UserModel = mongoose.model("User", UserSchema);

    init();

    var api = {
        login: login,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createNewUser: createNewUser,
        updateUserById: updateUserById,
        removeUserById: removeUserById,
        getUserByName: getUserByName
    };
    return api;

    function init(){
        UserModel.find({}, function(err, res){
            if(err){
                console.log(err);
            } else if(res == null || res == undefined || res.length == 0) {
                console.log("no users found, initializing db with data from mock file");
                var users = JSON.parse(fs.readFileSync(userPath));
                users.forEach(function (u) {
                    UserModel.create(u);
                });
            }
        })
    }

    function login(user) {
        var deferred = q.defer();

        var un = user['username'].toLowerCase();
        var pw = user['password'];
        UserModel.findOne({'username': un, 'password': pw}, function(err, data){
            if(err){
                deferred.resolve(null);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function getAllUsers() {
        var deferred = q.defer();
        UserModel.find({}, function(err, data){
            if(err){
                deferred.resolve(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function getUserByName(username){
        var deferred = q.defer();
        UserModel.findOne({'username': username.toLowerCase()}, function(err, data){
            if(err){
                deferred.resolve(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function getUserById(uid) {
        var deferred = q.defer();
        UserModel.findOne({'_id': uid}, function(err, data){
            if(err){
                deferred.resolve(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function createNewUser(newUser) {
        var deferred = q.defer();
        newUser['username'] = newUser['username'].toLowerCase();
        UserModel.create(newUser, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function updateUserById(uid, newUser) {
        var deferred = q.defer();
        newUser['username'] = newUser['username'].toLowerCase();
        UserModel.findOne({'_id': uid}, function(err, data){
           data.update(newUser, function(err, res){
               if(err){
                   deferred.reject(err);
               } else {
                   deferred.resolve(data);
               }
           });
        });
        return deferred.promise;
    }

    function removeUserById(uid) {
        var deferred = q.defer();

        UserModel.remove({'_id': uid}, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

};
