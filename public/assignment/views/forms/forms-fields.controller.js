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
            var newField = null;
            var newForm = $scope.form;
            switch($newType){
                case "Text":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "text": ""};
                    break;
                case "Date":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "date": null};
                    break;
                case "Dropdown":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": {}};
                    break;
                case "Checkbox":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": {}};
                    break;
                case "Radio Button":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": {}};
                    break;
                case "Paragraph":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "text": ""};
                    break;
                default:
                    console.log("unknown field type, update form-fields controller");
                    break;
            }
            if(newField != null) {
                newForm["fields"].push(newField);
                FormsService.updateFormById($scope.form["_id"], newForm, function($updatedForm){
                    $scope.form = $updatedForm;
                });
            }
        };

        $scope.addOption = function($field, $option){

        };

        console.log("forms-fields controller finished loading");
    }
})();
