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

                UserService.login(tUser)
                    .then(function(response){
                        UserService.setUser(response)
                            .then(function(r){
                            $scope.user = r;
                            $location.url("/profile");
                            }, function(err){
                                console.log("unable to set current user after authentication passed " + err);
                            });
                    }, function(error){
                        window.alert("unable to login: " + error);
                    });
            }
        };
        console.log("login controller finished loading");
    }
})();