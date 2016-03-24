/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("UserService", UserService);

    function UserService($http) {
        var currentUser = null;
        var users = [];
        function updateUsers() {
            $http.get("/rest/user")
                .success(function(response){
                    users = response;
                });
        }
        updateUsers();
        //was having trouble defining all the functions here
        //so added them to service array as they are created
        var service = {};

        service.user = function(callback){
            callback(currentUser);
        };

        service.setUser = function(id, callback){
            updateUsers();
            var result = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i]["_id"] == id){
                    currentUser = users[i];
                    result = currentUser;
                    break;
                }
            }
            callback(result);
        };

        service.logout = function(callback){
            currentUser = null;
            callback(currentUser);
        };

        service.checkID = function(username, callback){
            updateUsers();
            var result = null;
            for (var i = 0; i < users.length; i++) {
                if (users[i]["username"] == username){
                    result = users[i]["_id"];
                    break;
                }
            }

            callback(result);
        };

        service.findUserByCredentials = function (username, password, callback) {
            updateUsers();
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
            updateUsers();
            callback(users);
        };

        service.createUser = function (user, callback) {
            updateUsers();
            users.push(user);
            service.findUserByCredentials(user["username"], user["password"], callback);
        };

        service.deleteUserById = function (userId, callback) {
            updateUsers();
            users = users.filter(function (u) {
                return u["_id"] !== userId;
            });
            callback(users);
        };

        service.updateUser = function (user, callback) {
            for (var i = 0; i < users.length; ++i) {
                if (users[i]._id == user["_id"]) {
                    users[i] = user;
                    break;
                }
            }
            service.findUserByCredentials(user.username, user.password, callback);
        };

        console.log("finished loading user service functions");
        return service;
    }
    console.log("user service file loaded");
})();

