/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .controller("LoginController", ['$scope', '$location', 'UserService', LoginController]);

    function LoginController($scope, $location, UserService) {
        $scope.location = $location;

        $scope.login = function (username, password){
            if(username == null || password == null){
                console.log("something is blank");
            } else {

                UserService.findUserByCredentials(username, password, function($res){
                    if($res != null){
                        UserService.setUser($res, function($r){
                            $scope.user = $r;
                        });
                        $location.url("/");
                    } else {
                        window.alert("Wrong username/password combination");
                    }
                });




            }
        };

        console.log("login controller finished loading");
    }
})();