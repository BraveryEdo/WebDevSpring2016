/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("MainController",  ['$scope', '$location','UserService',  MainController]);

    function MainController($scope, $location, UserService, $q){

        $scope.location = $location;
        $scope.Username = null;
        $scope.showUsername = false;
        $scope.showRegister = true;
        $scope.showLogin = true;
        $scope.showAdmin = false;
        $scope.user = null;

        $scope.$on('$routeChangeSuccess', function() {
            var $res = UserService.getCurrentUser();
                if($res !== null){
                    console.log($res);
                    $scope.user = $res;
                    $scope.Username = $scope.user['username'];
                    $scope.showUsername = true;
                    $scope.showRegister = false;
                    $scope.showLogin = false;
                    var roles = $scope.user["roles"];
                    console.log(roles);
                    var res = false;
                    for(var i = 0; i < roles.length; i++){
                        if(roles[i] == "admin" || roles[i] == "Admin" || roles[i] == "ADMIN"){
                            res = true;
                            break;
                        }
                    }
                    $scope.showAdmin = res;
                } else {
                    $scope.Username = null;
                    $scope.showUsername = false;
                    $scope.showRegister = true;
                    $scope.showLogin = true;
                    $scope.showAdmin = false;
                    $scope.user = null;
                    console.log("no user session");
                }
        });
        console.log("main controller finished loading");
    }
})();


