/**
 * Created by EDO on 3/23/2016.
 */
"use strict";
module.exports = function (db, mongoose) {
    var q = require('q');
    var fs = require('fs');
    var formPath = "public/assignment/server/models/form.mock.json";
    var FieldSchema = require('./field.schema.server.js')(mongoose);
    var FieldModel = mongoose.model("Field", FieldSchema);
    var FormSchema = require('./form.schema.server.js')(mongoose, FieldSchema);
    var FormModel = mongoose.model("Form", FormSchema);


    init();

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

    function init(){
        FormModel.find({}, function(err, res){
            if(err){
                console.log(err);
            } else if(res == null || res == undefined || res.length == 0) {
                console.log("no forms found, initializing db with data from mock file");
                var forms = JSON.parse(fs.readFileSync(formPath));
                forms.forEach(function (f) {
                    FormModel.create(f);
                });
            }
        })
    }

    function shift(fid, f2id, dir){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form){
           if(err){
               deferred.reject(err);
           }  else {
               var fields = form['fields'];
               for(var j = 0; j < fields.length; j++){
                   if(f2id == fields[j]['_id']){
                       if((j == 0 && dir =="up") || (j == (fields.length - 1) && dir == "down")){
                           //trying to shift item out of range
                           //do nothing
                           deferred.resolve(getFormById(fid));
                           break;
                       } else {
                           if (dir == "up") {
                               var swap = fields[j - 1];
                               fields[j - 1] = fields[j];
                               fields[j] = swap;
                           } else { //"down"
                               var swap2 = fields[j + 1];
                               fields[j + 1] = fields[j];
                               fields[j] = swap2;
                           }
                           var newForm = form;
                           newForm['fields'] = fields;
                           newForm['updated'] = (new Date).getTime();
                           form.update(newForm, function(err){
                               if(err){
                                   deferred.reject(err);
                               } else {
                                   deferred.resolve(getFormById(fid));

                               }
                           });
                           break;
                       }
                   }
               }
           }
        });
        return deferred.promise;
    }

    function sort(uid){
        var deferred = q.defer();
        var uForms = [];
        FormModel.find({'userId': uid}, function(err, forms){
            if(err) {
                deferred.reject(err);
            } else {
                uForms = forms;
                uForms.reverse();
                //remove old forms with matching id and re add to the end in reverse order
                uForms.forEach(function(f){
                    FormModel.remove(f, function(err, res){
                        if(err){
                            console.log("form schema sorting error on delete");
                        } else {
                            FormModel.create(f);
                        }
                    });
                });
                deferred.resolve(uForms);
            }
        });
        return deferred.promise;
    }

    function getAllForms() {
        var deferred = q.defer();
        FormModel.find({}, function(err, forms) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(forms);
            }
        });
        return deferred.promise;
    }

    function getFormById(fid) {
        var deferred = q.defer();
        FormModel.findOne({'_id' : fid}, function(err, form) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form);
            }
        });
        return deferred.promise;
    }

    function findAllFormsForUser(uid) {
        var deferred = q.defer();
        FormModel.find({'userId' : uid}, function(err, forms) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(forms);
            }
        });
        return deferred.promise;
    }

    function createNewForm(newForm) {
        var deferred = q.defer();
        FormModel.create(newForm, function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                FormModel.findOne({'userId' : newForm['userId']}, function(err, form) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(findAllFormsForUser(form['userId']));
                    }
                });
            }
        });
        return deferred.promise;
    }

    function updateFormById(fid, newForm) {
        var deferred = q.defer();
        FormModel.findOne({'_id' : fid}, function(err, form) {
            if(err) {
                deferred.reject(err);
            } else {
                newForm['updated'] = (new Date).getTime();
                form.update(newForm, function(err){
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(form);
                    }
                });
            }
        });
        return deferred.promise;
    }

    function removeFormById(fid) {
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form) {
            if(err) {
                deferred.reject(err);
            } else {
                form.remove(function(err, res){
                    if(err){
                        deferred.reject(err);
                    } else {
                        deferred.resolve(findAllFormsForUser(form['userId']));
                    }
                });
            }
        });
        return deferred.promise;
    }

    //field functions
    function createFieldForForm(fid, newField){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                form['updated'] = (new Date).getTime();
                var fields = form['fields'];
                fields.push(newField);
                form['fields'] = fields;
                form.save(function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(getFormById(fid));
                    }
                });
            }
        });
        return deferred.promise;
    }


    function getFieldsForForm(fid){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form['fields']);
            }
        });
        return deferred.promise;
    }

    function getFieldForForm(fid, f2id){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form){
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(form['fields'].filter(function(f){return f2id == f['_id'];})[0]);
            }
        });
        return deferred.promise;
    }

    function deleteFieldFromForm(fid, f2id){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form) {
            if (err) {
                deferred.reject(err);
            } else {
                for (var j = 0; j < form['fields'].length; j++) {
                    if (f2id == form['fields'][j]['_id']) {
                        form['fields'].splice(j, 1);
                        form['updated'] = (new Date).getTime();
                        form.save(function (err) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(getFormById(fid));
                            }
                        });
                        break;
                    }
                }
            }
        });
        return deferred.promise;
    }

    function updateField(fid, f2id, fieldUpdate){
        var deferred = q.defer();
        FormModel.findOne({'_id': fid}, function(err, form){
            if(err) {
                deferred.reject(err);
            } else {
                var fields = form['fields'];
                for(var i = 0; i < fields.length; i++){
                    if(fields[i]['_id'] == f2id){
                        fields[i] = fieldUpdate;
                    }
                }
                form['fields'] = fields;
                form.save(function(err){
                    if(err){
                        deferred.reject(err);
                    } else {
                        deferred.resolve(getFormById(fid));
                    }
                });

            }
        });
        return deferred.promise;
    }

};
