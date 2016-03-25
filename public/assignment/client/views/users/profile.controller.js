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

                $scope.update = function($username, $password1,$password2, $fname, $lname){
                    if($password1 == $password2){
                        UserService.updateUser(
                            {
                                "_id": $scope.user['_id'],
                                "firstName": $fname,
                                "lastName": $lname,
                                "username": $username,
                                "password": $password1,
                                "roles": $res['roles']
                            },
                            function ($updated) {
                                if ($updated != null) {
                                    UserService.logout(function ($r) {
                                        if ($r == null) {
                                            $location.url('/');
                                            window.alert("information successfully updated, please log back in");
                                        } else {
                                            console.log("something went wrong while logging out");
                                            window.alert("something went wrong while logging out, some info may not update until next login");
                                        }});
                                } else {
                                    window.alert("Another user is already using this username");
                                }});
                    } else {
                        window.alert("passwords do not match, please verify that they are the same");
                    }
                };
            }
        });


        console.log("profile controller finished loading");
    }

})();