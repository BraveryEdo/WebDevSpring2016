"use strict";
(function(){

 angular
     .module("FormMakerApp")
     .controller("AdminController", AdminController);

 function AdminController($scope, $location){
  $scope.location = $location;
 }
})();
