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
            selectedForm = null;
            return "200";
        }

        function form(){
            return selectedForm;
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
            var uForm = form;
            uForm['_id'] = (new Date).getTime();
            uForm['userId'] = userId;
            return $http.post("/api/form", uForm);
        }

        function findAllFormsForUser(userId){
            return $http.get("/api/uform/" + userId);
        }

        function deleteFormById(formId){
            return $http.delete("/api/form/"+formId);
        }

        function updateFormById(formId, newForm){
            return $http.put("/api/form/"+formId, newForm);
        }

        console.log("finished loading form service functions");
    }
    console.log("form service file loaded");
})();

