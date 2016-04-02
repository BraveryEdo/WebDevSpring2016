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
            currentUser = user;
            getCurrentUser();
        }

        function getCurrentUser(){
            var deferred = $q.defer();
            if(currentUser != null) {
                deferred.resolve(currentUser);
            } else {
                deferred.reject(currentUser);
            }
            return deferred.promise;
        }

        function getUserById(id) {
            var deferred = $q.defer();

            $http.get("/api/user/"+id)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function updateUser(user) {
            var deferred = $q.defer();

            $http.put("/api/user/" + user._id, user)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function removeUser(id) {
            var deferred = $q.defer();

            $http.delete("/api/user/" + id)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function getAllUsers() {
            var deferred = $q.defer();

            $http.get("/api/user")
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function registerUser(user) {
            var deferred = $q.defer();

            $http.post("/api/user", user)
                .then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function login(user) {
            var deferred = $q.defer();

            $http.get("/api/login", user)
                .then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            $http.post("/api/logout")
                .then(
                    function(response) {
                        deferred.resolve(response);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }
    }
    console.log("user service file loaded");
})();

