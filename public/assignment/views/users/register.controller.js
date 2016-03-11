/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("RegisterController", ['$scope', '$location', RegisterController]);

    function RegisterController($scope, $location, UserService){
        $scope.location = $location;

        function register(info){
            console.log("registering info");

            if(info.password1 !== info.password2){
                $scope.window.alert("passwords do not match, please check passwords before trying again");
                return;
            }

            console.log(info);
            //var user = findUserByCredentials(username, password, callback) {
            //
            //}

        }

        console.log("register controller finished loading");
    }
})();