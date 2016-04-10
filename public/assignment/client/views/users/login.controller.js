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

                var info = {'username': username, 'password': password};

                UserService.login(info)
                    .then(function(response){
                         if(response == null || response == undefined || response.data == null || response.data == undefined){
                            window.alert("login failed");
                        } else {
                            UserService.setUser(response.data).then(function(u) {
                                $location.url("/profile");
                            });
                        }
                    });
            }
        };
        console.log("login controller finished loading");
    }
})();