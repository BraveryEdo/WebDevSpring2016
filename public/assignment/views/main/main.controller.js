/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp", [])
        .controller("MainController", MainController);

    function MainController($scope, $location){
        $scope.location = $location;
    }
})();