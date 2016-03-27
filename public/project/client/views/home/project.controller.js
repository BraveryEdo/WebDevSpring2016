//base connection code between p5 and SoundCloud adapted from Gregg Tavares's example sketch
//(sketch is the name for a processing output in the processing community)
// see: http://github.com/greggman/audiostreamsource.js for details

"use strict";
(function(){
    angular
        .module('FormMakerApp')
        .factory('viz', ['p5', function(p5) {
            return function(p){
                //JSON
                var clientID = '3ec04edf098e7efab4adfa28ea79ba39';

                var userID = '8379765';
                var width, height;
                var trackIDs = [];
                var trackNames = [];
                var trackNr;

                //Streaming
                var streamSource;
                var analyser, context;
                var streamData = new Uint8Array(128);
                var t = 0;

                var n_rings = 6;
                var ring_radius = [];

                //reserved p5 method
                p.preload = function(){
                    SC.initialize({
                        client_id: clientID
                    });
                    //Analyze a JSON request into function listTracks()
                    var loadTracks = 'http://api.soundcloud.com/users/' + userID + '/favorites/?client_id=' + clientID;
                    p.loadJSON(loadTracks, listTracks);
                };

                // Formatting JSON DATA from Soundcloud (called via preload())
                p.listTracks = listTracks;

                function listTracks (data) {
                    var i;
                    for (i = 0; i < data.length; i++) {
                        trackIDs[i] = data[i].id;
                    }
                    for (i = 0; i < data.length; i++) {
                        trackNames[i] = data[i].title;
                        //console.log('Name: ' + trackNames[i] + ', ID: ' + trackIDs[i]);
                    }
                }

                //reserved p5 method
                p.setup = function(){
                    setRes();
                    p.createCanvas(width, height, 'p3d');
                    p.noStroke();
                    setRingData();

                    resize();

                    context = new(window.AudioContext || window.webkitAudioContext);

                    //Create a Stream-Instance audio via audiostreamsource.js by Gregg Tavares
                    streamSource = audioStreamSource.create({
                        context: context, // a WebAudio context
                        loop: true, // true or false if you want it to loop
                        autoPlay: false, // true to autoplay (you don't want this. See below)
                        crossOrigin: false, // true to try to get crossOrigin permission
                    });

                    analyser = context.createAnalyser();

                    streamSource.on('newSource', function(source) {
                        streamSource.play();
                        source.connect(context.destination);
                        source.connect(analyser);
                    });

                    streamSource.on('error', function(err) {
                        alert("Trouble connecting to soundcloud, please try again");
                    });

                    trackNr = Math.floor(Math.random() * trackIDs.length); // create a random start number
                    var src = 'http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=' + clientID;
                    streamSource.setSource(src); // init src to play

                    //20 miliseconds = 50 updates everysecond
                    setInterval(sampleAudioStream, 16);   //analyse stream every 16 milliseconds
                };

                p.sampleAudioStream = sampleAudioStream;
                function sampleAudioStream(){
                    analyser.getByteFrequencyData(streamData);
                }


                //reserved p5 method
                p.mousePressed = function() {
                    if(p.mouseX > 0){
                        trackNr = Math.floor(Math.random() * trackIDs.length); // create random TrackNr
                        streamSource.setSource('http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=' + clientID);
                    }

                };

                //reserved p5 method
                p.touchStarted = function() {
                    if(p.touchX > 0){
                        trackNr = Math.floor(Math.random() * trackIDs.length); // create random TrackNr
                        streamSource.setSource('http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=' + clientID);
                    }
                };

                p.windowResized = resize;
                function resize(){
                    setRes();
                    p.resizeCanvas(width, height);
                    p.noStroke();
                    p.background(255);
                }

                function setRes(){
                    height = Math.min(window.innerHeight*0.8, 700);
                    width = document.body.clientWidth*0.8;
                }

                function displayInterface(){
                    //console.log('Name: ' + trackNames[trackNr] + ', ID: ' + trackIDs[trackNr]);
                }

                function reflectBot(x1, y1, x2, y2, color){
                    p.fill(color['r'], color['g'], color['b'], color['a']);
                    p.beginShape();
                    p.vertex(x1, height, 0);
                    p.vertex(x1, height-y1, 0);
                    p.vertex(x1, height-y1, 0);
                    p.vertex(x2, height-y2, 0);
                    p.vertex(x1, height, 0);
                    p.vertex(x1, height+y1, 0);
                    p.vertex(x1, height+y1, 0);
                    p.vertex(x2, height+y2, 0);
                    p.endShape('CLOSE');

                    p.vertex(width-x1, height, 0);
                    p.vertex(width-x1, height-y1, 0);
                    p.vertex(width-x1, height-y1, 0);
                    p.vertex(width-x2, height-y2, 0);
                    p.vertex(width-x1, height, 0);
                    p.vertex(width-x1, height+y1, 0);
                    p.vertex(width-x1, height+y1, 0);
                    p.vertex(width-x2, height+y2, 0);
                    p.endShape('CLOSE');

                }

                function spectro(){
                    var gmax = 100;
                    var s = (width/2)/(Math.max(1 ,streamData.length-5));
                    var c = {'r': 255, 'g': 128, 'b': 128, 'a': 60};
                    for(var i  = 0; i < streamData.length-1; i++){

                        var base = height;
                        var y1 = streamData[i];
                        var y2 = streamData[i+1];

                        p.noStroke();
                        reflectBot(s*i,y1,s*(i+1), y2, c);

                    }
                }

                function aurora(){
                    var s  = (width/2)/(streamData.length + 50);
                    var y_scale = 1/3;

                    var gmax = 100*Math.cos(t)

                    var y_pos = height/2.5;
                    //aurora(i, 255.0*sin(i*.05), 100.0, 0.0, floor(200*sin(10*PI*t/gmax)));
                    for(var i = 0; i < streamData.length; i++) {

                        var r = 255.0*Math.sin(t *.5+i*.05);
                        var g = 100*Math.cos(t+i*0.05);
                        var b = 100*Math.tan(t-i*0.5);
                        var a = 128;

                        var x1 = i*s;
                        var y1 = streamData[i]*y_scale;

                        p.stroke(r, g, b, a);
                        //left
                        p.line(x1, y_pos, x1, y_pos - y1);
                        p.line(x1, y_pos  , x1, y_pos + y1);
                        //right
                        p.line(width - x1, y_pos, width - x1, y_pos - y1);
                        p.line(width - x1, y_pos, width - x1, y_pos + y1);
                    }

                }

                function triSunPattern(){
                    var s = Math.sin(t);

                    p.stroke(0);
                    p.fill(Math.random()*255, 222, Math.random()*255, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[0], 2*t, false);
                    p.fill(31, 182, 222, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[1], 2*t, true);
                    p.fill(200, 180, 0, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[2], Math.PI+2*t, true);
                    p.fill(222, 31, 31, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[3], 2*t, true);
                    p.fill(218, 222, 31, 150);
                    ring(width/2.0, height/2.0, 6, ring_radius[4], t, true);
                    p.fill(229, 35, 35, 100);
                    ring(width/2.0, height/2.0, 11, 125, t, true);
                    p.fill(229, 136, 35, 100);
                    ring(width/2.0, height/2.0, 10, 125, -t, true);
                    p.fill(239, 255, 67, 100);
                    ring(width/2.0, height/2.0, 12, 125, 1.5*t, true);
                    p.fill(255, 255, 255, 10);
                    ring(width/2.0, height/2.0, 6, ring_radius[5], t, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 2, 1.1*t, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 4, 1.2*t, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 6, 1.3*t, true);
                    p.fill(0, 0, 0, 0);
                    p.stroke(255);
                    //equalizerRing(width/2.0, height/2.0, num_bars, t);
                    ring(width/2.0, height/2.0, 100, 177.5, -.75*t+2*s, false);
                    ring(width/2.0, height/2.0, 100, 175, -.75*t+2*s + Math.PI/100, true);
                }

                //creates a ring of outward facing triangles
                function ring(_x, _y, _n, _r, rot, ori) {
                    // _x, _y = center point
                    // _n = number of triangles in ring
                    // _r = radius of ring (measured to tri center point)
                    // ori = orientation true = out, false = in

                    var rads = 0;
                    var s = (_r*Math.PI/_n)*.9;
                    var diff = Math.PI*2/_n;

                    p.push();
                    p.translate(_x, _y, 0);
                    p.rotate(rot);
                    for (var i = 0; i < _n; i++) {
                        var tx = Math.sin(rads)*_r;
                        var ty = Math.cos(rads)*_r;
                        tri(tx, ty, 0, rads, s, ori);
                        rads += diff;
                    }
                    p.pop();
                }

                //creates an triangle with its center at _x, _y rotated by _r
                function tri(_x, _y, _z, _r, _s, ori) {
                    // _x, _y, _z= center point
                    // _r = rotation (radians)
                    // _s = triangle size (edge length in pixels)
                    // ori = determines if it starts pointed up or down

                    p.push();
                    p.translate(_x, _y, _z);

                    if (ori) {
                        p.rotate(Math.PI/2.0-_r);
                    } else {
                        p.rotate(Math.PI+Math.PI/2.0-_r);
                    }

                    polygon(0, 0, _s, 3);
                    p.pop();
                }

                // for creating regular polygons
                function polygon(x, y, radius, npoints) {
                    var angle = Math.PI*2 / npoints;
                    p.beginShape();
                    for (var a = 0; a < Math.PI*2 ; a += angle) {
                        var sx = x + Math.cos(a) * radius;
                        var sy = y + Math.sin(a) * radius;
                        p.vertex(sx, sy);
                    }
                    p.endShape('CLOSE');
                }

                function setRingData(){
                    var r = 50*Math.sin(t*0.02);
                    var r2 = 50*Math.cos(2*t*0.02);
                    ring_radius[0] = 75 + r2/2;
                    ring_radius[1] = 75 + r2/3;
                    ring_radius[2] = 30 + r2/3;
                    ring_radius[3] = 8 + r2/3;
                    ring_radius[4] = 100 - r2/1.5;
                    ring_radius[5] = 46 + r/2;
                }
                //reserved p5 method
                p.draw = function() {
                    setRingData();
                    p.clear();
                    p.background(0);
                    spectro();
                    aurora();
                    triSunPattern();
                    t++;
                };

                //reserved p5 method
                p.stop = function(){
                    streamSource.stop();
                };


            };
        }])
        .controller("ProjectController", ['$scope', '$location', ProjectController]);

    function ProjectController($scope, $location){
        console.log("project controller finished loading");
    }
})();