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
            var newForm = $scope.form;
            for(var i = 0; i < newForm['fields'].length; i++){
                if(newForm['fields'][i]["_id"] == $field["_id"]){
                    newForm['fields'][i] = $field;
                }
            }

            FormsService.updateFormById($scope.form["_id"], newForm, function($updatedForm){
                $scope.form = $updatedForm;
                window.alert("name change saved");
            });
        };


        $scope.deleteField = function($field){
            console.log("trying to delete");
            var newForm = $scope.form;
            var newFormFields = $scope.form['fields'].filter(function (u) {
                return u['_id'] !== $field['_id'];
            });

            newForm['fields'] = newFormFields;
            FormsService.updateFormById($scope.form["_id"], newForm, function($updatedForm){
                $scope.form = $updatedForm;
            });
        };

        $scope.moveField = function($field){
            window.alert("move");
            console.log($field);
        };

        $scope.addField = function($newType){
            switch($newType){
                case "Text":

                    break;
                case "Date":

                    break;
                case "Dropdown":

                    break;
                case "Checkbox":

                    break;
                case "Radio Button":

                    break;
                case "Paragraph":

                    break;
                default:
                    console.log("unknown field type, update forms-field controller");
                    break;
            }
        };

        console.log("forms-fields controller finished loading");
    }
})();
