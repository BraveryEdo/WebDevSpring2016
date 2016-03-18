/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("SidebarController", ['$scope', '$location', 'UserService', SidebarController]);
    function SidebarController($scope, $location, UserService){
        $scope.location = $location;

        console.log("sidebar controller finished loading");
    }
})();