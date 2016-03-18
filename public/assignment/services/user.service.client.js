/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("UserService", UserService);
    console.log("test 1");
    function UserService() {
        console.log("test 2");
        var users = [{"_id": 123, "firstName": "Alice", "lastName": "Wonderland", "username": "alice", "password": "alice", "roles": ["student"]},
                    {"_id": 234, "firstName": "Bob", "lastName": "Hope", "username": "bob", "password": "bob", "roles": ["admin"]},
                    {"_id": 345, "firstName": "Charlie", "lastName": "Brown", "username": "charlie", "password": "charlie", "roles": ["faculty"]},
                    {"_id": 456, "firstName": "Dan", "lastName": "Craig", "username": "dan", "password": "dan", "roles": ["faculty", "admin"]},
                    {"_id": 567, "firstName": "Edward", "lastName": "Norton", "username": "ed", "password": "ed", "roles": ["student"]},];

        var service = {};

        service.checkID = function(username, callback){
            var result = null;

            for (var i = 0; i < users.length; i++) {
                if (users[i]["username"] == username){
                    result = "found";
                    break;
                }
            }

            callback(result);
        };

        service.findUserByCredentials = function (username, password, callback) {
            var result = null;

            for (var i = 0; i < users.length; i++) {
                if (users[i]["username"] == username && users[i]["password"] == password) {
                    result = users[i];
                    break;
                }
            }
            callback(result);
        };

        service.findAllUsers = function (callback) {
            callback(users);
        };

        service.createUser = function (user, callback) {
            users.push(user);
            service.findUserByCredentials(user["username"], user["password"], callback);
        };

        service.deleteUserById = function (userId, callback) {
            users = users.filter(function (u) {
                return u["_id"] !== userId;
            });
            callback(users);
        };

        service.updateUser = function (userId, user, callback) {
            for (var i = 0; i < users.length; ++i) {
                if (users[i]._id == userId) {
                    users[i] = user;
                    break;
                }
            }
            service.findUserByCredentials(user.username, user.password, callback);
        };

        console.log("finished loading user service");
        return service;
    }
    console.log("user service file loaded");
})();

