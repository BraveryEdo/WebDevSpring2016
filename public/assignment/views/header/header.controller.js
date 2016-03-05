/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("HeaderController", HeaderController);

    function HeaderController($scope, $location){
        $scope.location = $location;
    }
})();