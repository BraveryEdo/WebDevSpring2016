/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("ProfileController", ['$scope', '$location', 'UserService', ProfileController]);

    function ProfileController($scope, $location, UserService){
        $scope.location = $location;
        UserService.user(function($res){
            if($res != null){
                $scope.username = $res["username"];
                $scope.password1 = $res["password"];
                $scope.password2 = $res["password"];
                $scope.fname = $res["firstName"];
                $scope.lname = $res["lastName"];
                $scope.email = $res["email"];

                $scope.update = function($username, $password1,$password2, $fname, $lname, $email){
                    if($password1 == $password2){
                        UserService.checkID($username, function($idCheck){
                            if($idCheck != null && $idCheck != $res["_id"]) {
                                window.alert("This username already exists");
                            } else {
                                UserService.updateUser(
                                    {
                                        "_id": $res["_id"],
                                        "firstName": $fname,
                                        "lastName": $lname,
                                        "username": $username,
                                        "password": $password1,
                                        "roles": $res["roles"],
                                        "email": $email
                                    },
                                    function ($updated) {
                                        if ($updated != null) {
                                            UserService.user(
                                                function ($result) {
                                                    $scope.user = $result;
                                                    $scope.username = $result["username"];
                                                    $scope.password1 = $result["password"];
                                                    $scope.password2 = $result["password"];
                                                    $scope.fname = $result["firstName"];
                                                    $scope.lname = $result["lastName"];
                                                    $scope.email = $result["email"];
                                                });

                                            UserService.logout(function ($r) {
                                                if ($r == null) {
                                                    $location.url('/');
                                                    window.alert("information successfully updated, please log back in");
                                                } else {
                                                    console.log("something went wrong while logging out");
                                                    window.alert("something went wrong while logging out, some info may not update until next login");
                                                }});

                                        } else {
                                            window.alert("update failed");
                                        }});}});
                    } else {
                        window.alert("passwords do not match, please verify that they are the same");
                    }
                };
            }
        });


        console.log("profile controller finished loading");
    }

})();