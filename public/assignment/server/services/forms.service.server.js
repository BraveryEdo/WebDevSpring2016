/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
define(function(require, exports, module) {
    module.exports = function (app, dp, mongoose, formModel) {
        app.get("/api/form", getAllForms);
        app.get("/api/form/:id", getFormById);
        app.post("/api/form", createNewForm);
        app.put("/api/form/:id", updateFormById);
        app.delete("/api/form/:id", removeFormById);

        function getAllForms(req, res) {
            console.log("forms.service.server.js:getAllForms");
            var forms = formModel.getAllForms();
            res.json(forms);
        }

        function getFormById(req, res) {
            var fid = req.params['id'];
            console.log("forms.service.server.js:getFormById");
            console.log(fid);
            var form = formModel.getFormById(fid);
            res.json(form);

        }

        function createNewForm(req, res) {
            var newForm = req.body;
            console.log("forms.service.server.js:CreateNewForm");
            var created = formModel.createNewForm(newForm);
            res.json(created);
        }

        function updateFormById(req, res) {
            var fid = req.params['id'];
            var newForm = req.body;
            console.log("forms.service.server.js:UpdateFormById");
            console.log(fid);
            var updated = formModel.updateFormById(fid, newForm);
            res.json(updated);
        }

        function removeFormById(req, res) {
            var fid = req.params['id'];
            console.log("forms.service.server.js:removeFormById");
            console.log(fid);
            var removed = formModel.removeFormById(fid);
            res.json(removed);
        }
    };

});