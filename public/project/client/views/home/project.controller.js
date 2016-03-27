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
                var start = (new Date).getSeconds();
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
                    p.createCanvas(width, height);
                    p.noStroke();

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


                function spectro(){
                    var gmax = 100;
                    var w = 1;
                    for(var i  = 0; i < streamData.length-1; i++){
                        var s = 2.75;
                        if(i*s > 2*width/5.0) {break;}

                        var y1 = height;
                        var y12 = streamData[i];

                        var y2 = streamData[i+w];
                        p.noStroke();
                        p.fill(255, 128, 128, 60);
                            //left
                        p.beginShape();
                        p.vertex(s*i, y1, 0);
                        p.vertex(s*i, y1-y12, 0);
                        p.vertex(s*i, y1-y12, 0);
                        p.vertex(s*(i+w), y1-y2, 0);

                        p.vertex(s*i, y1, 0);
                        p.vertex(s*i, y1+y12, 0);
                        p.vertex(s*i, y1+y12, 0);
                        p.vertex(s*(i+w), y1+y2, 0);
                        p.endShape('CLOSE');

                        //right
                        //graphics.beginShape();
                        p.beginShape();
                        p.vertex(width-s*i, y1, 0);
                        p.vertex(width-s*i, y1-y12, 0);
                        p.vertex(width-s*i, y1-y12, 0);
                        p.vertex(width-s*(i+w), y1-y2, 0);

                        p.vertex(width-s*i, y1, 0);
                        p.vertex(width-s*i, y1+y12, 0);
                        p.vertex(width-s*i, y1+y12, 0);
                        p.vertex(width-s*(i+w), y1+y2, 0);
                        p.endShape('CLOSE');

                    }
                }

                function aurora(){

                    var s  = (width/2)/(streamData.length + 50);
                    var s2 = 7;

                    var gmax = 100*Math.cos(t)

                    var y_pos = height/2.5;
                    //aurora(i, 255.0*sin(i*.05), 100.0, 0.0, floor(200*sin(10*PI*t/gmax)));
                    for(var i = 0; i < streamData.length; i++) {

                        var r = 255.0*Math.sin(i*.05);
                        var g = 100;
                        var b = 100*Math.tan(i*0.5);
                        var a = 128;

                        var x1 = i*s;
                        var y1 = streamData[i];

                        p.stroke(r, g, b, a);
                        //left
                        p.line(x1, y_pos, x1, y_pos - y1);
                        p.line(x1, y_pos + 1 , x1, y_pos + y1);
                        //right
                        p.line(width - x1, y_pos, width - x1, y_pos - y1);
                        p.line(width - x1, y_pos + 1, width - x1, y_pos + y1);
                    }

                }


                //reserved p5 method
                p.draw = function() {
                    p.clear();
                    //simpleSpectro();
                    spectro();
                    aurora();
                    t = (new Date).getSeconds() - start;
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