/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller('SidebarController', ['$rootScope', '$scope', '$location', SidebarController]);

    function SidebarController($rootScope, $scope, $location) {
        $scope.location = $location;
    }
})();