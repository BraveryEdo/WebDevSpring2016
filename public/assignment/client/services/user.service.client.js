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

        //was having trouble defining all the functions here
        //so added them to service array as they are created
        var service = {};

        function updateUsers() {
            $http.get("/rest/user")
                .success(function(response){
                    users = response;
                });
        }
        updateUsers();

        service.user = function(callback){
            callback(currentUser);
        };

        service.setUser = function(user, callback){
            updateUsers();
            var result = users.filter(function(u){return u['_id'] == user['_id'];});
            currentUser = result[0];
            callback(result[0]);
        };

        service.logout = function(callback){
            currentUser = null;
            callback(currentUser);
        };

        service.findUserByCredentials = function (username, password, callback) {
            updateUsers();
            var result = users.filter(function(u){return (u['username'] == username && u['password'] == password);});
            callback(result[0]);
        };

        service.findAllUsers = function (callback) {
            updateUsers();
            callback(users);
        };

        service.createUser = function (user, callback) {
            updateUsers();
            var check = users.filter(function(u){return u['username'] == user['username'];});
            if(check[0] != null) {
                $http.post("/rest/user", user)
                    .success(function (u) {
                        updateUsers();
                        callback(u);
                    });
            } else {
                callback(check[0]);
            }
        };

        service.deleteUserById = function (userId, callback) {
            $http.delete("/rest/user/"+userId)
                .success(function($users){ users = $users;callback(users);});
        };

        service.updateUser = function (user, callback) {
            var check = users.filter(function(u){return (u['username'] == user['username'] && u['_id'] !== user['_id']);})
            if(check[0] == null){
                $http.put("/rest/user/"+user['_id'], user)
                    .success(function(u){ updateUsers();callback(u);});
            } else {
                callback(null);
            }

        };

        console.log("finished loading user service functions");
        return service;
    }
    console.log("user service file loaded");
})();

