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
        $scope.selectedForm = null;

        UserService.user(function($user){
            $scope.user = $user;
            if($user != null){
                FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                    $scope.forms = $userForms;
                });
            }
        });



        $scope.addForm = function($name){
            var fields;
            if($scope.selectedForm = null){
                fields = [];
            } else {
                fields = $scope.slectedForm["fields"];
            }
            var form = {"_id": (new Date).getTime(), "title": $name, "userId": $scope.user["_id"], "fields": fields};
            FormsService.createFormForUser(userid, form, function($res){
                if($res == null){
                    console.log("same form name found for this user, aborting creation to avoid duplicates");
                    window.alert("You already have a form with this name, please use another name");
                } else {
                    FormsService.findAllFormsForUser($scope.user["_id"], function($userForms){
                        $scope.forms = $userForms;
                    });
                }

            });

        };

        $scope.updateForm = function($form){
            FormsService.updateFormById()
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
            $scope.selectedform = $form;
        };
        console.log("forms controller finished loading");
    }
})();