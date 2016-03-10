/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("HeaderController", ['$scope', '$location', HeaderController]);
    function HeaderController($scope, $location){
        $scope.location = $location;
        $scope.showRegister = true;
        $scope.showLogin = true;
        $scope.showAdmin = false;
        $scope.showUsername = true;
        console.log("header controller finished loading");
    }
})();