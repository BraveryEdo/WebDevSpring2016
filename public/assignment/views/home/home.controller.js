/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("HomeController", HomeController);

    function HomeController($scope, $location){
        $scope.location = $location;
    }
})();
