/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
module.exports = function (app, formModel) {
    app.get("/api/form", getAllForms);
    app.get("/api/form/:id", getFormById);
    app.get("/api/uform/:id", findAllFormsForUser);
    app.post("/api/form", createNewForm);
    app.put("/api/form/:id", updateFormById);
    app.delete("/api/form/:id", removeFormById);

    var service = {
        getAllForms: getAllForms,
        getFormById: getFormById,
        findAllFormsForUser: findAllFormsForUser,
        createNewForm: createNewForm,
        updateFormById: updateFormById,
        removeFormById: removeFormById
    };
    return service;


    function getAllForms(req, res) {
        var forms = formModel.getAllForms();
        res.json(forms);
    }

    function getFormById(req, res) {
        var fid = req.params['id'];
        var form = formModel.getFormById(fid);
        res.json(form);

    }

    function findAllFormsForUser(req, res){
        var uid = req.params['id'];
        var forms = formModel.findAllFormsForUser(uid);
        res.json(forms);
    }

    function createNewForm(req, res) {
        var newForm = req.body;
        var created = formModel.createNewForm(newForm);
        res.json(created);
    }

    function updateFormById(req, res) {
        var fid = req.params['id'];
        var newForm = req.body;
        var updated = formModel.updateFormById(fid, newForm);
        res.json(updated);
    }

    function removeFormById(req, res) {
        var fid = req.params['id'];
        var removed = formModel.removeFormById(fid);
        res.json(removed);
    }
};
