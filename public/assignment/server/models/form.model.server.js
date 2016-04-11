/**
 * Created by EDO on 3/23/2016.
 */
"use strict";
module.exports = function (db, mongoose) {
    var q = require('q');
    var fs = require('fs');
    var forms = [];
    var formPath = "public/assignment/server/models/form.mock.json";

    //var formSchema = mongoose.schema({
    //
    //});

    var api = {
        getAllForms: getAllForms,
        getFormById: getFormById,
        createNewForm: createNewForm,
        updateFormById: updateFormById,
        removeFormById: removeFormById,
        findAllFormsForUser: findAllFormsForUser,
        sort: sort,
        createFieldForForm: createFieldForForm,
        getFieldsForForm: getFieldsForForm,
        getFieldForForm: getFieldForForm,
        deleteFieldFromForm: deleteFieldFromForm,
        updateField: updateField,
        shift: shift
    };
    return api;

    //reads form file info into the forms array
    function readFormsFile(){
        forms = JSON.parse(fs.readFileSync(formPath));
    }

    //replaces the file contents with the local forms array
    function writeFormsFile(){
        fs.writeFileSync(formPath, JSON.stringify(forms, null, 4), 'utf-8');
    }

    function shift(fid, f2id, dir){
        var deferred = q.defer();
        readFormsFile();
        for (var i = 0; i < forms.length; i++){
            if (fid == forms[i]['_id']) {
                var fields = forms[i]['fields'];
                for(var j = 0; j < fields.length; j++){
                    if(f2id == fields[j]['_id']){
                        if((j == 0 && dir =="up") //out of range options
                            || (j == (fields.length - 1) && dir == "down")){
                            //do nothing
                            deferred.resolve(forms[i]);
                            break;
                        } else {
                            if (dir == "up") {
                                var swap = fields[j - 1];
                                fields[j - 1] = fields[j];
                                fields[j] = swap;
                            } else {

                                var swap = fields[j + 1];
                                fields[j + 1] = fields[j];
                                fields[j] = swap;
                            }
                            forms[i]['fields'] = fields;
                            writeFormsFile();
                            deferred.resolve(forms[i]);
                            break;
                        }
                    }
                }
            }
        }

        return deferred.promise;
    }

    function sort(uid){
        var deferred = q.defer();
        readFormsFile();
        var uForms = [];

        for(var i = 0; i < forms.length; i++){
            if(forms[i]['userId'] == uid){
                uForms.push(forms[i]);}}

        uForms.reverse();

        //remove old forms with matching id and re add to the end in reverse order
        for(var j = 0; j < uForms.length; j++){
            for (var index = 0; index < forms.length; index++){
                if (uForms[j]['_id'] == forms[index]['_id']){
                    forms.splice(index, 1);
                    forms.push(uForms[j]);
                    break;}}}

        deferred.resolve(uForms);
        writeFormsFile();
        return deferred.promise;
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
        deferred.resolve(forms.filter(function(f){return f['userId'] == newForm['userId'];}));
        writeFormsFile();
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
        writeFormsFile();
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
        writeFormsFile();
        return deferred.promise;
    }

    //field functions
    function createFieldForForm(fid, newField){
        var deferred = q.defer();
        readFormsFile();
        for (var i = 0; i < forms.length; i++){
            if (fid == forms[i]['_id']) {
                forms[i]['fields'].push(newField);
                deferred.resolve(forms[i]);
                break;
            }
        }
        writeFormsFile();
        return deferred.promise;
    }


    function getFieldsForForm(fid){
        var deferred = q.defer();
        readFormsFile();
        deferred.resolve(forms.filter(function(f){return f['_id'] == fid;})[0]['fields']);
        return deferred.promise;
    }

    function getFieldForForm(fid, f2id){
        var deferred = q.defer();
        readFormsFile();
        var form = forms.filter(function(f){return f['_id'] == fid;});
        var field = form['fields'].filter(function(f2){return f2['_id'] == f2id;});
        deferred.resolve(field);
        return deferred.promise;
    }

    function deleteFieldFromForm(fid, f2id){
        var deferred = q.defer();
        readFormsFile();
        for (var index = 0; index < forms.length; index++) {
            if (fid == forms[index]['_id']) {
                for(var j = 0; j < forms[index]['fields'].length; j++){
                    if(f2id == forms[index]['fields'][j]['_id']){
                        forms[index]['fields'].splice(j, 1);
                        deferred.resolve(forms[index]);
                        break;
                    }
                }
            }
        }
        writeFormsFile();
        return deferred.promise;
    }

    function updateField(fid, f2id, fieldUpdate){
        var deferred = q.defer();
        readFormsFile();
        for (var index = 0; index < forms.length; index++) {
            if (fid == forms[index]['_id']) {
                for(var j = 0; j < forms[index]['fields'].length; j++){
                    if(f2id == forms[index]['fields'][j]['_id']){
                        forms[index]['fields'][j] = fieldUpdate;
                        deferred.resolve(forms[index]);
                        break;
                    }
                }
            }
        }
        writeFormsFile();
        return deferred.promise;
    }

};
