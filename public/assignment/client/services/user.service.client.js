/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("UserService", UserService);

    function UserService($http, $q) {

        var currentUser = null;

        var service = {
            register: registerUser,
            login: login,
            loggedin: loggedin,
            logout: logout,
            updateUser: updateUser,
            getAllUsers: getAllUsers,
            getUserById: getUserById,
            removeUser: removeUser,
            setUser: setUser,
            getCurrentUser: getCurrentUser,
            findUserByUsername: findUserByUsername
        };
        return service;

        function loggedin(){
            var deferred = $q.defer();
            $http.get("/api/loggedin").then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function findUserByUsername(username){
            var deferred = $q.defer();
            $http.get("/api/user/name/"+username).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function setUser(user){
            var deferred = $q.defer();
            currentUser = user;
            deferred.resolve(currentUser);
            return deferred.promise;

        }

        function getCurrentUser(){
            var deferred = $q.defer();
            deferred.resolve(currentUser);
            return deferred.promise;

        }

        function getUserById(id) {
            var deferred = $q.defer();
            $http.get("/api/user/"+id).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function updateUser(user) {
            var deferred = $q.defer();
            $http.put("/api/user/" + user._id, user).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function removeUser(id) {
            var deferred = $q.defer();
            $http.delete("/api/user/" + id).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function getAllUsers() {
            var deferred = $q.defer();
            $http.get("/api/user").then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function registerUser(user) {
            var deferred = $q.defer();
            $http.post("/api/user", user).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function login(user) {
            var deferred = $q.defer();
            $http.post("/api/login", user).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            currentUser = null;
            $http.post("/api/logout").then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }
    }
    console.log("user service file loaded");
})();

