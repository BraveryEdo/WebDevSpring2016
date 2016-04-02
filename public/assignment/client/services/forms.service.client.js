/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("FormsService", FormsService);

    function FormsService($http, $q) {
        var selectedForm = null;

        var service = {
            logout: logout,
            form: form,
            setForm: setForm,
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };

        function logout(){
            selectedForm = null;
            return "200";
        }

        function form(){
            var deferred = $q.defer();
            if(selectedForm != null) {
                deferred.resolve(selectedForm);
            } else {
                deferred.reject(selectedForm);
            }
            return deferred.promise;
        }

        function setForm(form){
            if(selectedForm == form){
                selectedForm = null;
            } else {
                selectedForm = form;
            }
            return selectedForm;
        }

        function createFormForUser(userId, form){
            var deferred = $q.defer();
            var uForm = form;
            uForm['_id'] = (new Date).getTime();
            uForm['userId'] = userId;
            $http.post("/api/form", uForm)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        }

        function findAllFormsForUser(userId){
            var deferred = $q.defer();
            $http.get("/api/form")
                .then(function(response){
                    var uForms = response.data.filter(function (f) { return f['userId'] == userId;});
                    deferred.resolve(response.data);
                }, function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function deleteFormById(formId){
            var deferred = $q.defer();
            $http.delete("/api/form/"+formId)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        }

        function updateFormById(formId, newForm){
            var deferred = $q.defer();
            $http.put("/api/form/"+formId, newForm)
                .then(
                    function(response) {
                        deferred.resolve(response.data);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        }


        console.log("finished loading form service functions");
        return service;
    }
    console.log("form service file loaded");
})();

