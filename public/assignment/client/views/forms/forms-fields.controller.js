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
        $scope.newOptionText = "";
        FormsService.form(function($f){
            $scope.form = $f;

        });

        $scope.editField = function($field){
            var newForm = null;
            FormsService.form(function(f){
                newForm = f;
            });
            for(var i = 0; i < newForm['fields'].length; i++){
                if(newForm['fields'][i]['_id'] == $field['_id']){
                    newForm['fields'][i] = $field;
                }
            }
            FormsService.updateFormById($scope.form['_id'], newForm, function($updatedForm){
                $scope.form = $updatedForm;
                window.alert("change saved!");
            });
        };


        $scope.deleteField = function($field){
            console.log("trying to delete");
            var newForm = $scope.form;
            var newFormFields = $scope.form['fields'].filter(function (u) {
                return u['_id'] !== $field['_id'];
            });

            newForm['fields'] = newFormFields;
            FormsService.updateFormById($scope.form['_id'], newForm, function($updatedForm){
                $scope.form = $updatedForm;
            });
        };

        $scope.addField = function($newType){
            var newField = null;
            var newForm = null;
            FormsService.form(function(f){
                newForm = f;
            });
            var empty = [];
            switch($newType){
                case "Text":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "text": "", "addOption": false};                    break;
                case "Date":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "date": null, "addOption": false};
                    break;
                case "Dropdown":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": empty, "addOption": false};
                    break;
                case "Checkbox":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": empty, "addOption": false};
                    break;
                case "Radio Button":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "options": empty, "addOption": false};
                    break;
                case "Paragraph":
                    newField = {"_id": (new Date).getTime(), "type": $newType, "title": $scope.newFieldTitle, "text": "", "addOption": false};
                    break;
                case null:
                    console.log("no field type chosen");
                    break;
                default:
                    console.log("unknown field type, update form-fields controller");
                    break;
            }
            if(newField != null) {
                newForm["fields"].push(newField);
                FormsService.updateFormById(newForm['_id'], newForm, function($updatedForm){
                    $scope.form = $updatedForm;
                });
            }
        };

        $scope.addOption = function($field, $newOptionText){
            $scope.newOptionText = $newOptionText;
            var newForm = $scope.form;
            var fields = $scope.form['fields'];

            for(var i = 0; i < fields.length; i++){
                if(fields[i]['_id'] == $field['_id']){
                    var options = fields[i]['options'];
                    console.log("adding option: " + $scope.newOptionText);
                    options.push({'_id': (new Date).getTime(),'text': $scope.newOptionText});
                    fields[i]['options'] = options;
                    fields[i]['addOption'] = false;
                    newForm['fields'] = fields;
                    break;
                }
            }
            FormsService.updateFormById($scope.form['_id'], newForm, function($updatedForm){
                $scope.form = $updatedForm;
                $scope.newOptionText = "";
                console.log("addOption toggled");
            });
        };

        $scope.showOption = function($field){
            return $field['addOption'];
        };

        $scope.toggleOption = function($field){
            var newForm = $scope.form;
            var fields = $scope.form['fields'];
            for(var i = 0; i < fields.length; i++){
                if(fields[i]['_id'] == $field['_id']){
                    newForm['fields'][i]['addOption'] = !newForm['fields'][i]['addOption'];
                    break;
                }
            }

            FormsService.updateFormById($scope.form['_id'], newForm, function($updatedForm){
                $scope.form = $updatedForm;
                console.log("addOption toggled");
            });

        };

        console.log("forms-fields controller finished loading");
    }
})();
