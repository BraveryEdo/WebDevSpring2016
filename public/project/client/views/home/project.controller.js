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
                var volume;

                //graphics intermediary between data and screen
                var g;

                var ball;

                var g_x = 1000;
                var g_y = 700;


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
                    g = p.createGraphics(g_x, g_y);
                    g.noStroke();

                    resize();

                    context = new(window.AudioContext || window.webkitAudioContext);

                    //Create a Stream-Instance audio via audiostreamsource.js by Gregg Tavares
                    streamSource = audioStreamSource.create({
                        context: context, // a WebAudio context
                        loop: false, // true or false if you want it to loop
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
                    displayTrackName(trackNr);
                    var src = 'http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=4e842f222306d63d61112b8daed9af68';
                    streamSource.setSource(src); // init src to play

                    //20 miliseconds = 50 updates everysecond
                    setInterval(sampleAudioStream, 16);   //analyse stream every 16 milliseconds
                };

                function displayTrackName(trackNr){
                    console.log('Name: ' + trackNames[trackNr] + ', ID: ' + trackIDs[trackNr]);
                }

                p.sampleAudioStream = sampleAudioStream;
                function sampleAudioStream(){
                    analyser.getByteFrequencyData(streamData);
                }


                //reserved p5 method
                p.mousePressed = function() {
                    if(p.mouseX > 0){
                        trackNr = Math.floor(Math.random() * trackIDs.length); // create random TrackNr
                        streamSource.setSource('http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=4e842f222306d63d61112b8daed9af68');
                    }
                };

                //reserved p5 method
                p.touchStarted = function() {
                    if(p.touchX > 0){
                        trackNr = Math.floor(Math.random() * trackIDs.length); // create random TrackNr
                        streamSource.setSource('http://api.soundcloud.com/tracks/' + trackIDs[trackNr] + '/stream?client_id=4e842f222306d63d61112b8daed9af68');
                    }
                };

                p.windowResized = resize;
                function resize(){
                    setRes();
                    p.resizeCanvas(height, width);
                    p.noStroke();
                    p.background(255);
                }

                function setRes(){
                    height = window.innerHeight*2/3;
                    width  = window.innerWidth*2/3;
                }

                //reserved p5 method
                p.draw = function(){
                    p.clear();
                    g.clear();


                    var nBins = streamData.length;
                    var xWidth = Math.floor(g_x/nBins);
                    g.noStroke();
                    g.fill(255, 128, 128, 128);
                    g.beginShape();
                    for(var i = 0; i < nBins; i++){
                        if(i == 0){
                            g.vertex(0,g_y);
                        } else {
                            g.vertex((i-1)*xWidth, g_y-streamData[i-1]);
                        }
                        g.vertex(i*xWidth, g_y-streamData[i+1]);
                    }
                    g.vertex(g_x, g_y);
                    g.endShape('CLOSE');

                    g.stroke(20);
                    g.fill(0);
                    g.line(0,0, g_x, g_y);
                    g.line(g_x,0,0, g_y);


                    p.image(g, 0, 0, g_x, g_y, 0, 0, g_x, g_y);


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