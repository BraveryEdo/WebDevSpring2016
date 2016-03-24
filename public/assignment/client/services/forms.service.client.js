/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("FormsService", FormsService);

    function FormsService() {
        var currentForm = null;
        var forms = [
            {"_id": "000", "title": "Contacts", "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "alice", "text": "555-555-5555", "addOption": false},]},
            {"_id": "010", "title": "ToDo",     "userId": 123, "fields": [{"_id": 0, "type": "Text", "title": "go shopping", "text": "before friday's party"},{"_id": 1, "type": "Text", "title": "finish writing paper", "text": "continue with chapter 3 research", "addOption": false},]},
            {"_id": "020", "title": "CDs",      "userId": 234, "fields": [{"_id": 0, "type": "Text", "title": "Pink Floyd", "text": "The Dark Side of the Moon"}, {"_id": 1, "type": "Text", "title": "Pendulum", "text": "Hold Your Colour", "addOption": false},]},
        ];

        var service = {};

        service.logout = function(callback){
            currentForm = null;
            callback(currentForm);
        };

        service.form = function(callback){
            callback(currentForm);
        };

        service.setForm = function(form, callback){
            currentForm =  form;
            callback(currentForm);
        };

        service.pushForm = function(form, callback){
            forms.push(form);
            callback(forms);
        };

        service.createFormForUser = function(userId, form, callback){
            form["_id"] = (new Date).getTime();
            form["userId"] = userId;

            service.findAllFormsForUser(userId, function($allForms){
                var $result = "true";
                for(var i = 0; i < $allForms.length; i++){
                    if($allForms[i]["title"] == form["title"]){
                        $result = "false";
                        break;
                    }
                }

                if($result == "false"){
                    callback(null);
                } else {
                    service.pushForm(form, callback);
                }
            });
        };

        service.findAllFormsForUser = function(userId, callback){
            var found = [];

            for(var i = 0; i <  forms.length; i++){
                if(forms[i]["userId"] == userId){
                    found.push(forms[i]);
                }
            }

            callback(found);
        };

        service.deleteFormById = function(formId, callback){
            forms = forms.filter(function (u) {
                return u["_id"] !== formId;
            });
            callback(forms);
        };

        service.updateFormById = function(formId, newForm, callback){
            var $res = null;
            for(var i = 0; i <  forms.length; i++){
                if(forms[i]["_id"] == formId){
                    newForm["_id"] = formId;
                    forms[i] = newForm;
                    $res = forms[i];
                    break;
                }
            }
            callback($res);
        };


        console.log("finished loading form service functions");
        return service;
    }
    console.log("form service file loaded");
})();

