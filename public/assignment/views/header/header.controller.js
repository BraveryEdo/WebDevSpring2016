/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("HeaderController", ['$scope', '$location', 'UserService', HeaderController]);
    function HeaderController($scope, $location, UserService){
        $scope.logout = function (){
            UserService.logout(function(res){
                if(res == null){
                    console.log("successfully logged user out");
                }
            });
        };
        console.log("header controller finished loading");
    }
})();