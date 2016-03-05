/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("SidebarController", SidebarController);

    function SidebarController($scope, $location){
        $scope.location = $location;
    }
})();