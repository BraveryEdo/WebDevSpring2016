/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("FormsService", FormsService);

    function FormsService($http) {
        var currentForm = null;
        var forms = [];
        function updateForms() {
            $http.get("/rest/user")
                .success(function(response){
                    forms = response;
                });
        }
        updateForms();
        //was having trouble defining all the functions here
        //so added them to service array as they are created
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
            $http.put("/rest/form", form)
                .success(callback);
        };

        service.createFormForUser = function(userId, form, callback){
            form['_id'] = (new Date).getTime();
            form['userId'] = userId;

            $http.post("/rest/form", form)
                .success(callback);

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

