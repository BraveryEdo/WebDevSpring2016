"use strict"
module.exports = function(app, db, mongoose, passport, LocalStrategy, userModel){
    app.get("/api/user", getAllUsers);
    app.get("/api/user/:id", getUserById);
    app.post("/api/user", createNewUser);
    app.put("/api/user/:id", updateUserById);
    app.delete("/api/user/:id", removeUserById);

    function getAllUsers(req, res){
        console.log("users.service.server.js:getAllUsers");
        res.json(null);
    }

    function getUserById(req, res){
        var uid = req.params['id'];
        console.log("users.service.server.js:getUserById");
        console.log(uid);
        res.json(null);

    }

    function createNewUser(req, res){
        var newUser = req.body;
        console.log("users.service.server.js:CreateNewUser");
        res.json(null);
    }

    function updateUserById(req, res){
        var uid = req.params['id'];
        var newUser = req.body;
        console.log("users.service.server.js:UpdateUserById");
        console.log(uid);
        res.json(null);
    }

    function removeUserById(req, res){
        var uid = req.params['id'];
        var requester = req.body;
        console.log("users.service.server.js:removeUserById");
        console.log(uid);
        res.json(null);
    }
};
