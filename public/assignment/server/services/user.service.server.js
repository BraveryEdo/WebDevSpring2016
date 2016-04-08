"use strict";
module.exports = function (app, userModel) {
    app.get("/api/user", getAllUsers);
    app.get("/api/user/:id", getUserById);
    app.post("/api/user", createNewUser);
    app.put("/api/user/:id", updateUserById);
    app.delete("/api/user/:id", removeUserById);
    app.post("/api/login", login);
    app.post("/api/logout", logout);

    var service = {
        login: login,
        logout: logout,
        getAllUsers: getAllUsers,
        getUserById: getUserById,
        createNewUser: createNewUser,
        removeUserById: removeUserById,
        updateUserById: updateUserById
    };
    return service;

    function login(req, res) {
        var u = req.body;
        userModel.login(u).then(function(r){ res.json(r) });
    }

    function logout(req, res) {
        res.json(null);
    }

    function getAllUsers(req, res) {
        var users = userModel.getAllUsers();
        res.json(users);
    }

    function getUserById(req, res) {
        var uid = req.params['id'];
        console.log(uid);
        var user = userModel.getUserById(uid);
        res.json(user);

    }

    function createNewUser(req, res) {
        var newUser = req.body;
        var created = userModel.createNewUser(newUser);
        res.json(created);
    }

    function updateUserById(req, res) {
        var uid = req.params['id'];
        var newUser = req.body;
        var updated = userModel.updateUserById(uid, newUser);
        res.json(updated);
    }

    function removeUserById(req, res) {
        var uid = req.params['id'];
        var removed = userModel.removeUserById(uid);
        res.json(removed);
    }
};
