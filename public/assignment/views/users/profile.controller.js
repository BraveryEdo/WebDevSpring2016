/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("ProfileController", ['$scope', '$location', ProfileController]);

    function ProfileController($scope, $location){
        $scope.location = $location;
        console.log("profile controller finished loading");
    }
})();