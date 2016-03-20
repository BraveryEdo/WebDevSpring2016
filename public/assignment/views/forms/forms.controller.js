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
            if($user != null){
                FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                    $scope.forms = $userForms;
                    FormsService.form(function($f){
                        $scope.selectedForm = $f;
                        if($f != null){
                            $scope.newFormName = $f["title"];
                        }
                    });
                });
            }
        });



        $scope.addForm = function($name){
            var fields;
            if($scope.selectedForm == null){
                fields = [];
            } else {
                fields = $scope.slectedForm["fields"];
            }

            if($name == "" || $name == null){
                window.alert("The form needs a name");
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
                        });
                    }

                });
            }
        };

        $scope.updateForm = function($form){
            if($scope.selectedForm["_id"] == $form["_id"]){
                if($scope.newFormName == ""){
                    window.alert("please don't leave the form's name blank");
                } else {
                    $form["title"] = newFormName;
                }
            }

            $scope.newFormName = $form["title"];
            $scope.selectedForm = $form;
            FormsService.setForm($form, function($res){
                if($res != $form){
                    console.log("form not selected correctly for editing");
                }
            });
            console.log("updating " + $scope.Username + "'s form, id#" + $form["_id"]);
           $location.url('/form-fields');
        };

        $scope.deleteForm  = function($form){
            FormsService.deleteFormById($form["_id"], function($res){
                FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                    $scope.forms = $userForms;
                });
            });
        };

        $scope.selectForm  = function($form){
            $scope.newFormName = $form["title"];
            $scope.selectedForm = $form;
            FormsService.setForm($form, function($res){
                if($res != $form){
                    console.log("form not selected correctly for editing");
                }
            });
        };

        console.log("forms controller finished loading");
    }
})();