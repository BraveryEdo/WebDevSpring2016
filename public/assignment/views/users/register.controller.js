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

        $scope.register = function (username, password1, password2, email){

            if(password1 !== password2){
                window.alert("passwords do not match, please check passwords before trying again");
            }

            UserService.findUserByCredentials(username, password1, function(result){console.log("register result: " + result);});

        };



        console.log("register controller finished loading");
    }
})();