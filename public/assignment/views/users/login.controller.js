/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("LoginController", LoginController);

    function LoginController($scope, $location){
        $scope.location = $location;
    }
})();