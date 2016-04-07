/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function() {
    angular
        .module("FormMakerApp")
        .controller("LoginController", ['$scope', '$location', 'UserService', LoginController]);

    function LoginController($scope, $location, UserService, $q) {
        $scope.location = $location;

        $scope.login = function (username, password){
            if(username == null || password == null){
                console.log("something is blank");
            } else {

                var info = {'username': username, 'password': password};

                UserService.login(info)
                    .then(function(response){
                        if(response == null || response == undefined){
                            window.alert("login failed");
                        } else {
                            console.log(response);
                            UserService.setUser(response.data);
                            $scope.user = response.data;
                            $scope.Username = response.data['username'];
                            $scope.showUsername = true;
                            $scope.showRegister = false;
                            $scope.showLogin = false;
                            console.log(response.data);
                            var roles = response.data['roles'];
                            var res = false;
                            if (roles !== null) {
                                for (var i = 0; i < roles.length; i++) {
                                    if (roles[i] == "admin" || roles[i] == "Admin" || roles[i] == "ADMIN") {
                                        res = true;
                                        break;
                                    }
                                }
                            } else {
                                console.log("roles null: " + roles);
                            }
                            $scope.showAdmin = res;
                            $location.url("/profile");
                        }
                    });
            }
        };
        console.log("login controller finished loading");
    }
})();