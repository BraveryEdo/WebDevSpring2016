/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("HeaderController", ['$scope', '$location', 'UserService', 'FormsService', HeaderController]);
    function HeaderController($scope, $location, UserService, FormsService){
        $scope.logout = function (){
            UserService.logout(function(res){
                FormsService.logout(function($res){
                    if($res == null){
                        console.log("cleaned up form data");
                    }
                });
                if(res == null){
                    console.log("successfully logged user out");
                    $location.url('/');
                }
            });
        };
        console.log("header controller finished loading");
    }
})();