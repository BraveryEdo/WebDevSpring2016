/**
 * Created by EDO on 3/11/2016.
 */
"use strict";
(function(){
    angular
        .module("FormMakerApp")
        .factory('viz', ['p5', function(p5) {
            return function(p) {
                //static variables

                var r = p.random(0, 255);
                var g = p.random(0, 255);

                p.setup = function() {
                    p.createCanvas(480, 270);
                    p.noStroke();
                };

                p.draw = function() {
                    var colorAngle = p.radians(p.frameCount);
                    var colorVector = p5.Vector.fromAngle(colorAngle).setMag(255);

                    p.background(r, g, colorVector.x);
                    p.fill(r, g, colorVector.y);
                    p.rect(0, 0, p.width / 2, p.height);
                };
            };
        }])
        .controller("ProjectController", ['$scope', '$location', ProjectController]);

    function ProjectController($scope, $location){
        console.log("project controller finished loading");
    }


})();
