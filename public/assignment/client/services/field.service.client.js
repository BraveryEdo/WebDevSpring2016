/**
 * Created by EDO on 3/10/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .factory("FieldService", FieldService);

    function FieldService($http, $q) {

        var service = {
            createFieldForForm: createFieldForForm,
            getFieldsForForm: getFieldsForForm,
            getFieldForForm: getFieldForForm,
            deleteFieldFromForm: deleteFieldFromForm,
            updateField: updateField
        };
        return service;

        function createFieldForForm(formId, field){
            var deferred = $q.defer();
            $http.post("/api/field/" + formId, field).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function getFieldsForForm(formId){
            var deferred = $q.defer();
            $http.get("/api/field/" + formId).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function getFieldForForm(formId, fieldId){
            var deferred = $q.defer();
            $http.get("/api/field/" + formId + "/" + fieldId).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function deleteFieldFromForm(formId, fieldId){
            var deferred = $q.defer();
            $http.delete("/api/field/" + formId + "/" + fieldId).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }

        function updateField(formId, fieldId, field){
            var deferred = $q.defer();
            $http.put("/api/field/" + formId + "/" + fieldId, field).then(function(r){deferred.resolve(r);});
            return deferred.promise;
        }


    }
    console.log("field client service file loaded");
})();

