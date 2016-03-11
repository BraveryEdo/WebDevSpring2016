/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("MainController",  ['$scope', '$location', MainController]);

    function MainController($scope, $location){
        $scope.location = $location;
        $scope.Username = null;
        $scope.showUsername = false;
        $scope.showRegister = true;
        $scope.showLogin = true;
        $scope.showAdmin = false;
        console.log("main controller finished loading");
    }
})();


