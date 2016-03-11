/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
var users = [];
(function() {
    angular
        .module("FormMakerApp")
        .factory("UserService", UserService);

    function UserService() {

        var service = { findUserByCredentials : findUserByCredentials,
            findAllUsers : findAllUsers,
            createUser : createUser,
            deleteUserById : deleteUserById,
            updateUser : updateUser};

        return service;


        console.log("gg");
        users.push({"_id": 123, "firstName": "Alice", "lastName": "Wonderland",
            "username": "alice", "password": "alice", "roles": ["student"]});
        users.push({"_id": 234, "firstName": "Bob", "lastName": "Hope",
                "username": "bob", "password": "bob", "roles": ["admin"]});
        users.push({"_id": 345, "firstName": "Charlie", "lastName": "Brown",
                "username": "charlie", "password": "charlie", "roles": ["faculty"]});
        users.push({"_id": 456, "firstName": "Dan", "lastName": "Craig",
                "username": "dan", "password": "dan", "roles": ["faculty", "admin"]});
        users.push({"_id": 567, "firstName": "Edward", "lastName": "Norton",
                "username": "ed", "password": "ed", "roles": ["student"]});

        function findUserByCredentials(username, password, callback){
            var result = null;

            for(var i = 0; i < users.length; i++) {
                if (users[i].username == username && users[i].password == password){
                    result = users[i];
                    break;
                }
            }
            callback(result);
        }

        function findAllUsers(callback){
            callback(users);
        }

        function createUser(user, callback){
            user._id = (new Date()).getTime();
            users.push(user);
            findUserByCredentials(user.username, user.password, callback);
        }

        function deleteUserById(userId, callback){
            users = users.filter(function (u) {return u._id !== userId;});
            callback(users);
        }

        function updateUser(userId, user, callback){
            for(var i = 0; i < users.length; ++i) {
                if (users[i]._id == userId) {
                    users[i] = user;
                    break;
                }
            }
            findUserByCredentials(user.username, user.password, callback);
        }
    }
    console.log("finished loading user service");

})();