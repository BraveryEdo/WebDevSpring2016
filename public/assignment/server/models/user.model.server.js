/**
 * Created by EDO on 3/23/2016.
 */
"use strict";
module.exports = function (db, mongoose){
    var q = require('q');
    var fs = require('fs');
    var users = [];

    var api = {
        login: login,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createNewUser: createNewUser,
        updateUserById: updateUserById,
        removeUserById: removeUserById
    };
    return api;

    function readUsersFile(){
        users = JSON.parse(fs.readFileSync("public/assignment/server/models/user.mock.json"));
    }

    function login(user) {
        readUsersFile();

        var deferred = q.defer();
        var un = user['username'];
        var pw = user['password'];
        var luser = users.filter(function (u) {
            return u['username'] == un && u['password'] == pw;
        });

        deferred.resolve(luser[0]);
        return deferred.promise;
    }

    function getAllUsers() {
        var deferred = q.defer();
        readUsersFile();
        deferred.resolve(users);
        return deferred.promise;
    }

    function getUserById(uid) {
        var deferred = q.defer();
        readUsersFile();
        deferred.resolve(users.filter(function (u) {
            return u['_id'] == uid;
        }));

        return deferred.promise;
    }

    function createNewUser(newUser) {
        var deferred = q.defer();
        readUsersFile();
        users.push(newUser);
        deferred.resolve(newUser);
        return deferred.promise;
    }

    function updateUserById(uid, newUser) {
        var deferred = q.defer();
        readUsersFile();

        var filt = users.filter(function (u) {
            return u['username'] == newUser['username'];
        });

        if (filt.length > 0 && filt[0]['_id'] !== uid) {
            console.log("uid fail");
            deferred.resolve(null);
            return deferred.promise;
        }

        for (var i = 0; i < users.length; i++) {
            if (users[i]['_id'] == uid) {
                users[i]['title'] = newUser['title'];
                users[i]['firstName'] = newUser['firstName'];
                users[i]['lastName'] = newUser['lastName'];
                users[i]['username'] = newUser['username'];
                users[i]['password'] = newUser['password'];
                users[i]['roles'] = newUser['roles'];
                deferred.resolve(users[i]);
                break;
            }
        }
        return deferred.promise;
    }

    function removeUserById(uid) {
        var deferred = q.defer();
        readUsersFile();
        var index;
        for (index = 0; index < users.length; index++) {
            if (uid == users[index]['_id']) {
                users.splice(index, 1);
                deferred.resolve(users);
                break;
            }
        }

        return deferred.promise;
    }

};
