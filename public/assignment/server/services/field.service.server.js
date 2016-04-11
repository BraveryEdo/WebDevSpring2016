/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
module.exports = function (app, formModel) {
    app.post("/api/field/:formId", createFieldForForm);
    app.get("/api/field/:formId", getFieldsForForm);
    app.get("/api/field/:formId/:fieldId", getFieldForForm);
    app.delete("/api/field/:formId/:fieldId", deleteFieldFromForm);
    app.put("/api/field/:formId/:fieldId", updateField);
    app.post("/api/field/shift/:formId/:fieldId/:dir", shift);

    var service = {
        createFieldForForm: createFieldForForm,
        getFieldsForForm: getFieldsForForm,
        getFieldForForm: getFieldForForm,
        deleteFieldFromForm: deleteFieldFromForm,
        updateField: updateField,
        shift: shift
    };
    return service;

    function shift(req, res){
        var fid = req.params['formId'];
        var f2id = req.params['fieldId'];
        var dir = req.params['dir'];
        formModel.shift(fid, f2id, dir).then(function(r){res.json(r);});
    }

    function createFieldForForm(req, res){
        var fid = req.params['formId'];
        var newField = req.body;
        formModel.createFieldForForm(fid, newField).then(function(r){res.json(r);});
    }

    function getFieldsForForm(req, res){
        var fid = req.params['formId'];
        formModel.getFieldsForForm(fid).then(function(r){res.json(r);});
    }

    function getFieldForForm(req, res){
        var fid = req.params['formId'];
        var f2id = req.params['fieldId'];
        formModel.getFieldForForm(fid, f2id).then(function(r){res.json(r);});
    }

    function deleteFieldFromForm(req, res){
        var fid = req.params['formId'];
        var f2id = req.params['fieldId'];
        formModel.deleteFieldFromForm(fid, f2id).then(function(r){res.json(r);});
    }

    function updateField(req, res){
        var fid = req.params['formId'];
        var f2id = req.params['fieldId'];
        var fieldUpdate = req.body;
        formModel.updateField(fid, f2id, fieldUpdate).then(function(r){res.json(r);});
    }
};
