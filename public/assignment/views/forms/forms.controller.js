/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("FormsController", FormsController);

    function FormsController($scope, $location){
        $scope.location = $location;
    }
})();