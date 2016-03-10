/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("SidebarController", ['$scope', '$location', SidebarController]);
    function SidebarController($scope, $location){
        $scope.location = $location;
        $scope.showRegister = true;
        $scope.showLogin = true;
        $scope.showAdmin = false;
        $scope.showUsername = true;
        console.log("sidebar controller finished loading");
    }
})();