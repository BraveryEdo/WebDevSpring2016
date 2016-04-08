/**
 * Created by EDO on 3/23/2016.
 */
"use strict";

module.exports = function (db, mongoose) {
    var q = require('q');
    var fs = require('fs');
    var forms = [];

    //var formSchema = mongoose.schema({
    //
    //});

    var api = {
        getAllForms: getAllForms,
        getFormById: getFormById,
        createNewForm: createNewForm,
        updateFormById: updateFormById,
        removeFormById: removeFormById,
        findAllFormsForUser: findAllFormsForUser
    };
    return api;

    function readFormsFile(){
        forms = JSON.parse(fs.readFileSync("public/assignment/server/models/form.mock.json"));
    }

    function getAllForms() {
        var deferred = q.defer();
        readFormsFile();
        deferred.resolve(forms);
        return deferred.promise;
    }

    function getFormById(fid) {
        var deferred = q.defer();
        readFormsFile();
        deferred.resolve(forms.filter(function (f) {return f['_id'] == fid;}));
        return deferred.promise;
    }

    function findAllFormsForUser(uid) {
        var deferred = q.defer();
        readFormsFile();
        var uForms = forms.filter(function (f) {return f['userId'] == uid;});
        deferred.resolve(uForms);
        return deferred.promise;
    }

    function createNewForm(newForm) {
        var deferred = q.defer();
        readFormsFile();
        forms.push(newForm);
        deferred.resolve(forms);
        return deferred.promise;
    }

    function updateFormById(fid, newForm) {
        var deferred = q.defer();
        readFormsFile();
        for (var i = 0; i < forms.length; i++){
            if (fid == forms[i]['_id']) {
                forms[i]['userId'] = newForm['userId'];
                forms[i]['title'] = newForm['title'];
                forms[i]['fields'] = newForm['fields'];
                deferred.resolve(forms[i]);
                break;
            }
        }
        return deferred.promise;
    }

    function removeFormById(fid) {
        var deferred = q.defer();
        readFormsFile();
        var index;
        for (index = 0; index < forms.length; index++) {
            if (fid == forms[index]['_id']) {
                forms.splice(index, 1);
                break;
            }
        }
        deferred.resolve(forms);
        return deferred.promise;
    }
};
