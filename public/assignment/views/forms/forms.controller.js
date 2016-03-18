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
                });
            }
        });



        $scope.addForm = function(){

        };

        $scope.updateForm = function(){

        };

        $scope.deleteForm  = function($form){

        };

        $scope.selectForm  = function($form){

        };
        console.log("forms controller finished loading");
    }
})();