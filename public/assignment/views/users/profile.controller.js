/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("ProfileController", ['$scope', '$location', ProfileController]);

    function ProfileController($scope, $location, UserService){
        $scope.location = $location;
        consoleTestUserService(UserService);
        console.log("profile controller finished loading");
    }

    function consoleTestUserService(UserService){
        console.log("find user by creds tests:");
        console.log("username doesn't exist");
        UserService.findUserByCredentials("user007", "notsafepass", function(res){ console.log(res); });
        console.log("wrong password");
        UserService.findUserByCredentials("Alice", "notsafepass", function(res){ console.log(res); });
        console.log("logged in!");
        UserService.findUserByCredentials("Alice", "Wonderland", function(res){ console.log(res); });
        console.log("find user by creds tests:");
    }
})();