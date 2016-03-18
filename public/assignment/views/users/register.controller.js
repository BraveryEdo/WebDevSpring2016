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

        $scope.register = function ($fname, $lname, $username, $password1, $password2, $email){
            console.log($fname);
            if($fname == null || $lname == null || $username == null || $password1 == null || $password2 == null || $email == null){
                console.log("something is blank");
            } else {

                UserService.checkID($username,
                    function($result){
                        if($result == "found"){
                            window.alert("This username already exists");
                        } else {
                            if($password1 !== $password2){
                                console.log($password1 + " : " + $password2);
                                window.alert("passwords do not match, please check passwords before trying again");
                            } else {

                                var user = {
                                    "_id": (new Date()).getTime(),
                                    "firstName": $fname,
                                    "lastName": $lname,
                                    "username": $username,
                                    "password": $password1,
                                    "roles": ["student"]
                                };

                                UserService.createUser(user,
                                    function($res){
                                        if($res != null){
                                            console.log("user successfully registered");
                                        }});
                            }
                        }
                    }
                )
            }
        };

        console.log("register controller finished loading");
    }
})();