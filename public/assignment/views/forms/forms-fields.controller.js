/**
 * Created by EDO on 3/2/2016.
 */

"use strict";
(function(){
    angular
        .module('FormMakerApp')
        .controller("FormsFieldsController", ['$scope', '$location', 'FormsService', FormsFieldsController]);

    function FormsFieldsController($scope, $location, FormsService){
        $scope.location = $location;
        FormsService.form(function($f){
            $scope.form = $f;
        });

        $scope.editField = function($field){
            window.alert("edit");
            console.log($field);
        };


        $scope.deleteField = function($field){
            console.log("trying to delete");
            var newForm = $scope.form;
            newForm['fields'].filter(function (u) {
                return u['_id'] !== $field['_id'];
            });

            FormsService.updateFormById($scope.form["_id"], newForm, function($updatedForm){
                $scope.form = $updatedForm;
            });
        };

        $scope.moveField = function($field){
            window.alert("move");
            console.log($field);
        };
        console.log("forms-fields controller finished loading");
    }
})();
