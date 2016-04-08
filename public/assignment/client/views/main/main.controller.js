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
            UserService.getCurrentUser().then(function(u){
                if(u == null){
                    $scope.Username = null;
                    $scope.showUsername = false;
                    $scope.showRegister = true;
                    $scope.showLogin = true;
                    $scope.showAdmin = false;
                    $scope.user = null;
                    console.log("no user session found");
                } else {
                    $scope.user = u;
                    var roles = u['roles'];
                    var res = false;
                    for (var i = 0; i < roles.length; i++) {
                        if (roles[i] == "admin" || roles[i] == "Admin" || roles[i] == "ADMIN") {
                            res = true;
                            console.log("an admin has logged in!");
                            break;
                        }
                    }
                    $scope.Username = u['username'];
                    $scope.showUsername = true;
                    $scope.showRegister = false;
                    $scope.showLogin = false;
                    $scope.showAdmin = res;
                }
            });
        });
        console.log("main controller finished loading");
    }
})();


