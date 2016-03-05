/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
    angular
        .module("FormMakerApp")
        .controller('SidebarController', ['$scope', '$location', SidebarController]);

    function SidebarController($scope, $location) {
            $scope.location = $location;
    }