/**
 * Created by EDO on 3/11/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .controller("ProjectController", ['$scope', '$location', ProjectController]);

    function ProjectController($scope, $location){

        console.log("project controller finished loading");
    }
})();

