"use strict";
(function(){

 angular
     .module("FormMakerApp")
     .controller("AdminController", ['$scope', '$location', AdminController]);

 function AdminController($scope, $location){
     $scope.location = $location;
     console.log("admin controller finished loading");
 }
})();
