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
            logout: logout,
            updateUser: updateUser,
            getAllUsers: getAllUsers,
            getUserById: getUserById,
            removeUser: removeUser,
            setUser: setUser,
            getCurrentUser: getCurrentUser
        };
        return service;


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
            $http.get("/api/user/"+id)
                .success(function(r){
                    deferred.resolve(r);
                });
            return deferred.promise;
        }

        function updateUser(user) {
            $http.put("/api/user/" + user._id, user)
                .success(function(r){
                    deferred.resolve(r);
                });
            return deferred.promise;
        }

        function removeUser(id) {
            var deferred = $q.defer();
            $http.delete("/api/user/" + id)
                .success(function(r){
                    deferred.resolve(r);
                });
            return deferred.promise;
        }

        function getAllUsers() {
            var deferred = $q.defer();
            $http.get("/api/user")
                .success(function(r){
                    deferred.resolve(r);
                });
            return deferred.promise;
        }

        function registerUser(user) {
            var deferred = $q.defer();
            $http.post("/api/user", user)
                .success(function(data, status, headers, config){
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        function login(user) {
            var deferred = $q.defer();
            var data = $http.post("/api/login", user);
            deferred.resolve(data);
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            currentUser = null;
            $http.post("/api/logout")
                .success(function(r){
                    deferred.resolve(r);
                });
            return deferred.promise;
        }
    }
    console.log("user service file loaded");
})();

