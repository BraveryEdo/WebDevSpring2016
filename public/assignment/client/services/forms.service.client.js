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
        return service;

        function logout(){
            var deferred = $q.defer();
            selectedForm = null;
            deferred.resolve("200");
            return deferred.promise;
        }

        function form(){
            var deferred = $q.defer();
            deferred.resolve(selectedForm);
            return deferred.promise;
        }

        function setForm(form){
            var deferred = $q.defer();
            if(selectedForm == form){
                selectedForm = null;
            } else {
                selectedForm = form;
            }
            deferred.resolve(selectedForm);
            return deferred.promise;
        }

        function createFormForUser(userId, form){
            var deferred = $q.defer();
            var uForm = form;
            uForm['_id'] = (new Date).getTime();
            uForm['userId'] = userId;
            $http.post("/api/form", uForm)
                .success(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function findAllFormsForUser(userId){
            var deferred = $q.defer();
            $http.get("/api/uform/" + userId).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function deleteFormById(formId){
            var deferred = $q.defer();
            $http.delete("/api/form/"+formId).success(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function updateFormById(formId, newForm){
            var deferred = $q.defer();
            $http.put("/api/form/"+formId, newForm).success(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        console.log("finished loading form service functions");
    }
    console.log("form service file loaded");
})();

