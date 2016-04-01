/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
module.exports = function(app, db, mongoose, passport, LocalStrategy, formModel){
    app.get("/api/form", getAllForms);
    app.get("/api/form/:id", getFormById);
    app.post("/api/form", createNewForm);
    app.put("/api/form/:id", updateFormById);
    app.delete("/api/form/:id", removeFormById);

    function getAllForms(req, res){
        console.log("forms.service.server.js:getAllForms");
        res.json(null);
    }

    function getFormById(req, res){
        var fid = req.params['id'];
        console.log("forms.service.server.js:getFormById");
        console.log(fid);
        res.json(null);

    }

    function createNewForm(req, res){
        var newForm = req.body;
        console.log("forms.service.server.js:CreateNewForm");
        res.json(null);
    }

    function updateFormById(req, res){
        var fid = req.params['id'];
        var newForm = req.body;
        console.log("forms.service.server.js:UpdateFormById");
        console.log(fid);
        res.json(null);
    }

    function removeFormById(req, res){
        var fid = req.params['id'];
        var requester = req.body;
        console.log("forms.service.server.js:removeFormById");
        console.log(fid);
        res.json(null);
    }
};

