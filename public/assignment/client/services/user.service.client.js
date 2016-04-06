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
            return currentUser;
        }

        function getUserById(id) {
            return $http.get("/api/user/"+id);
        }

        function updateUser(user) {
            return $http.put("/api/user/" + user._id, user);
        }

        function removeUser(id) {
            return $http.delete("/api/user/" + id);
        }

        function getAllUsers() {
           return $http.get("/api/user");
        }

        function registerUser(user) {
            return $http.post("/api/user", user);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }
    }
    console.log("user service file loaded");
})();

