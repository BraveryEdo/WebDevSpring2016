/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("RegisterController", ['$scope', '$location', 'UserService', RegisterController]);

    function RegisterController($scope , $location, UserService){
        $scope.locaiton = $location;

        $scope.register = function ($username, $password1, $password2){

            if($username == null || $password1 == null || $password2 == null){
                console.log("something is blank");
            } else {
                if($password1 !== $password2){
                    console.log($password1 + " : " + $password2);
                    window.alert("passwords do not match, please check passwords before trying again");
                } else {

                    var user = {
                        "_id": (new Date()).getTime(),
                        "firstName": "",
                        "lastName": "",
                        "username": $username,
                        "password": $password1,
                        "roles": ["Student"]
                    };

                    UserService.register(user)
                        .then(function($res){
                            console.log("user successfully registered");
                            window.alert("thanks for registering, You can now login");
                            $location.url("/login");

                        }, function(err){
                            window.alert("This username already exists " + err);
                        });
                }
            }
        };

        console.log("register controller finished loading");
    }
})();