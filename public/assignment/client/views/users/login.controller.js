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

                var tUser = {'username': username, 'password': password};

                var response = UserService.login(tUser);
                 if(response !== null){
                        var setResp = UserService.setUser(response);
                            if(setResp !== null) {
                                $scope.user = setResp;
                                $location.url("/profile");
                            } else {
                                console.log("unable to set current user after authentication passed");
                            }
                    } else {
                        window.alert("login failed");
                    }
            }
        };
        console.log("login controller finished loading");
    }
})();