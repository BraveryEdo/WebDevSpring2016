/**
 * Created by EDO on 3/2/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller('HeaderController', ['$rootScope', '$scope', '$location', HeaderController]);

    function HeaderController($rootScope, $scope, $location) {
        $scope.location = $location;
    }
})();