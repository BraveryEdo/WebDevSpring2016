/**
 * Created by EDO on 3/2/2016.
 */

"use strict";
(function(){
    angular
        .module('FormMakerApp')
        .controller("FormsFieldsController", ['$scope', '$location', FormsFieldsController]);

    function FormsFieldsController($scope, $location){
        $scope.location = $location;
    }
})();
