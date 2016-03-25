/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("FormsService", FormsService);

    function FormsService($http) {
        var selectedForm = null;
        var forms = [];
        function updateForms() {
            $http.get("/rest/form")
                .success(function(response){
                    forms = response;
                });
        }
        updateForms();
        //was having trouble defining all the functions here
        //so added them to service array as they are created
        var service = {};

        service.logout = function(callback){
             selectedForm = null;
            callback(selectedForm);
        };

        service.form = function(callback){
            callback(selectedForm);
        };

        service.setForm = function(form, callback){
            if(selectedForm == form){
                selectedForm = null;
            } else {
                selectedForm = form;
            }
            updateForms();
            callback(selectedForm);
        };

        service.createFormForUser = function(userId, form, callback){
            var uForm = form;
            uForm['_id'] = (new Date).getTime();
            uForm['userId'] = userId;

            service.findAllFormsForUser(userId, function($f){
                var titleMatch =  $f.filter(function (f){
                    return f['title'] == form['title'];
                });

                if(titleMatch[0] == null){
                    $http.post("/rest/form", uForm)
                        .success(function(f){callback(f);});
                } else {
                    callback(null);
                }
            });
        };

        service.findAllFormsForUser = function(userId, callback){
            $http.get("/rest/form")
                .success(function($f){
                    var uForms = $f.filter(function (f) { return f['userId'] == userId;});
                    callback(uForms);
                });
        };

        service.deleteFormById = function(formId, callback){
            $http.delete("/rest/form/"+formId)
                .success(function(f){callback(f)});
        };

        service.updateFormById = function(formId, newForm, callback){
            $http.put("/rest/form/"+formId, newForm)
                .success(function(f){updateForms();callback(f);});
        };


        console.log("finished loading form service functions");
        return service;
    }
    console.log("form service file loaded");
})();

