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

                UserService.checkID(username,
                    function ($result) {
                        if ($result != null) {
                            UserService.findUserByCredentials(username, password, function($res){
                                if($res != null){
                                    $scope.user = $res;
                                    UserService.setUser($result, function($r){

                                    });
                                    $location.url("/");
                                } else {
                                    window.alert("Wrong username/password combination");
                                }
                            });
                        } else {
                            window.alert("This username does not exist in our records");
                        }
                    });
            }
        };

        console.log("login controller finished loading");
    }
})();