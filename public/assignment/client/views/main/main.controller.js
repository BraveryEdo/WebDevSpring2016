/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("MainController",  ['$scope', '$location','UserService',MainController]);

    function MainController($scope, $location, UserService, $q){
        $scope.location = $location;
        $scope.Username = null;
        $scope.showUsername = false;
        $scope.showRegister = true;
        $scope.showLogin = true;
        $scope.showAdmin = false;
        $scope.user = null;

        $scope.$on('$routeChangeSuccess', function() {
            var u = UserService.getCurrentUser();
               if(u == null){
                   $scope.Username = null;
                   $scope.showUsername = false;
                   $scope.showRegister = true;
                   $scope.showLogin = true;
                   $scope.showAdmin = false;
                   $scope.user = null;
                   console.log("no user session found");
               }
        });
        console.log("main controller finished loading");
    }
})();


