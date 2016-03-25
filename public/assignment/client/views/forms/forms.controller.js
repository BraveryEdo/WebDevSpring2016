/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("FormsController", ['$scope', '$location', 'FormsService', 'UserService', FormsController]);

    function FormsController($scope, $location, FormsService, UserService){
        $scope.location = $location;

        UserService.user(function($user){
            $scope.user = $user;

            FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                $scope.forms = $userForms;
                FormsService.form(function($f){
                    selectForm($f);
                });
            });

        });



        $scope.addForm = addForm;
        function addForm($name){
            var fields;
            if($scope.selectedForm == null){
                fields = [];
            } else {
                fields = $scope.selctedForm['fields'];
            }

            if($name == "" || $name == null){
                window.alert("Please set a name or select a form");
            } else {
                var form = {
                    "_id": (new Date).getTime(),
                    "title": $name,
                    "userId": $scope.user["_id"],
                    "fields": fields
                };
                FormsService.createFormForUser($scope.user["_id"], form, function ($res) {
                    if ($res == null) {
                        console.log("same form name found for this user, aborting creation to avoid duplicates");
                        window.alert("You already have a form with this name, please use another name");
                    } else {
                        FormsService.findAllFormsForUser($scope.user["_id"], function ($userForms) {
                            $scope.forms = $userForms;
                            selectForm($res);
                        });
                    }

                });
            }
        }

        $scope.updateForm = function($form){
            if($scope.selectedForm !== null && $scope.selectedForm['_id'] == $form['_id']){
                $form['title'] = $scope.newFormName;
            }
            FormsService.updateFormById($form['_id'], $form, function(res){
                console.log("updating " + $scope.Username + "'s form, id#" + $form["_id"]);
                selectForm(res);
                $location.url('/form-fields');
            });

        };

        $scope.deleteForm  = function($form){
            FormsService.deleteFormById($form["_id"], (function(){
                FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                    $scope.forms = $userForms;
                });
            })());
        };

        $scope.selectForm  = selectForm;
        function selectForm($form) {
            //if ($scope.selectedForm == null||($scope.selectedForm['_id'] !== $form['_id'])){
                FormsService.setForm($form, function ($res) {
                    if($res !== null){
                        $scope.newFormName = $res["title"];
                        $scope.selectedForm = $res;
                    } else {
                        $scope.newFormName = null;
                        $scope.selectedForm = null;
                    }
                });

        }

        console.log("forms controller finished loading");
    }
})();