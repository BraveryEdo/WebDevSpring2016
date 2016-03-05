/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("RegisterController", ['$scope', '$location', RegisterController]);

    function RegisterController($scope, $location){
        $scope.location = $location;
    }
})();