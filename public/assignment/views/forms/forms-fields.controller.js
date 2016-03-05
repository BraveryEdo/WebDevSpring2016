/**
 * Created by EDO on 3/2/2016.
 */

"use strict";
(function(){
    angular
        .module('FormMakerApp')
        .controller("FormsFieldsController", FormsFieldsController);

    function FormsFieldsController($scope, $location){
        $scope.location = $location;
    }
})();
