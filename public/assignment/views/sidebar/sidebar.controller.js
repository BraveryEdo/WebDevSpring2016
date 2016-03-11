/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("SidebarController", ['$scope', '$location', SidebarController]);
    function SidebarController($scope, $location){
        console.log("sidebar controller finished loading");
    }
})();