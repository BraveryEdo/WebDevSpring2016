/**
 * Created by EDO on 3/2/2016.
 */

"use strict";
(function(){
    angular
        .module('FormMakerApp')
        .controller("FormsFieldsController", ['$scope', '$location', 'FieldService', 'FormsService', FormsFieldsController]);

    function FormsFieldsController($scope, $location, FieldService,FormsService){
        $scope.location = $location;
        $scope.newOptionText = "";
        FormsService.form().then(function($f){$scope.form = $f;});

        $scope.editField = function($field){
            FieldService.updateField($scope.form['_id'], $field['_id'] ,$field).then(function($updatedForm){
                    $scope.form = $updatedForm.data;
                    window.alert("change saved!");
                });
        };


        $scope.deleteField = function($field){
            FieldService.deleteFieldFromForm($scope.form['_id'], $field['_id']).then(function(f){
                $scope.form = f.data;
            });
        };

        $scope.shift = function($fid, dir){
          FieldService.shift($scope.form['_id'], $fid, dir).then(function(f){
                  $scope.form = f.data;
              });
        };

        $scope.addField = function($newType){
            var newField = null;

            var empty = [];

            //perhaps extract this to the form model so i send it a type string then receive a template of that type
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
            if(newField !== null) {
                FieldService.createFieldForForm($scope.form['_id'], newField).then(function($updatedForm){$scope.form = $updatedForm.data;});
            } else {
                window.alert("please choose an option from the dropdown menu");
            }

        };

        $scope.addOption = function($field, $newOptionText){
            $scope.newOptionText = $newOptionText;
            var fields = $scope.form['fields'];
            var i;
            for(i = 0; i < fields.length; i++){
                if(fields[i]['_id'] == $field['_id']){
                    var options = fields[i]['options'];
                    options.push({'_id': (new Date).getTime(),'text': $scope.newOptionText});
                    fields[i]['options'] = options;
                    fields[i]['addOption'] = false;
                    break;
                }
            }

            FieldService.updateField($scope.form['_id'], $field['_id'], fields[i]).then(function($updatedForm){
                $scope.form = $updatedForm.data;
                $scope.newOptionText = "";
            });
        };

        $scope.showOption = function($field){
            return $field['addOption'] == true;
        };

        $scope.toggleOption = function($field){
            var fields = $scope.form['fields'];
            var i;
            for(i = 0; i < fields.length; i++){
                if(fields[i]['_id'] == $field['_id']){
                    fields[i]['addOption'] = !fields[i]['addOption'];
                    break;
                }
            }

            FieldService.updateField($scope.form['_id'], $field['_id'], fields[i]).then(function($updatedForm){
                $scope.form = $updatedForm.data;
                console.log("addOption toggled");
            });

        };

        console.log("forms-fields controller finished loading");
    }
})();
