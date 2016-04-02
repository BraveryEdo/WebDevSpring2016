

"use strict";
define(function(require, exports, module) {
    module.exports = function (app, db, mongoose, passport, LocalStrategy, userModel) {
        app.get("/api/user", getAllUsers);
        app.get("/api/user/:id", getUserById);
        app.post("/api/user", createNewUser);
        app.put("/api/user/:id", updateUserById);
        app.delete("/api/user/:id", removeUserById);
        app.get("/api/login", login);
        app.post("/api/logout", logout);

        function login(req, res) {
            console.log("users.service.server.js:login");
            var u = req.body;
            var r = userModel.login(u);
            res.json(r);
        }

        function logout(req, res) {
            console.log("users.service.server.js:logout");
        }

        function getAllUsers(req, res) {
            console.log("users.service.server.js:getAllUsers");
            var users = userModel.getAllUsers();
            res.json(users);
        }

        function getUserById(req, res) {
            var uid = req.params['id'];
            console.log("users.service.server.js:getUserById");
            console.log(uid);
            var user = userModel.getUserById(uid);
            res.json(user);

        }

        function createNewUser(req, res) {
            var newUser = req.body;
            console.log("users.service.server.js:CreateNewUser");
            var created = userModel.createNewUser(newUser);
            res.json(created);
        }

        function updateUserById(req, res) {
            var uid = req.params['id'];
            var newUser = req.body;
            console.log("users.service.server.js:UpdateUserById");
            console.log(uid);
            var updated = userModel.updateUserById(uid, newUser);
            res.json(updated);
        }

        function removeUserById(req, res) {
            var uid = req.params['id'];
            console.log("users.service.server.js:removeUserById");
            console.log(uid);
            var removed = userModel.removeUserById(uid);
            res.json(removed);
        }
    };
});