//base connection code between p5 and SoundCloud adapted from Gregg Tavares's example sketch
//(sketch is the name for a processing output in the processing community)
// see: http://github.com/greggman/audiostreamsource.js for details

"use strict";
(function(){
    //rem has this scope so that the controller cna access the closing call for the p5 sketch
    var rem;
    angular
        .module('FormMakerApp')
        .controller('ProjectController',['$scope', '$location', ProjectController])
        .factory('viz', ['p5', function(p5) {
            return function(p){
                //visualizer vars
                var width, height;
                var Hover = false;
                var lastHover = 999999;
                var n_rings = 6;
                var ring_radius = [];

                //setting up to stream from soundcloud
                var clientID = '3ec04edf098e7efab4adfa28ea79ba39';
                //my personal userID, please don't reuse
                var userID = '8379765';
                var clientSecret = 'eaaa1cef71e0d6dab383127009b1bed7';
                var streamSource;
                var analyser, context;
                var streamData = new Uint8Array(128);
                var trackIDs = [];
                var trackNames = [];
                var extLink = [];
                var trackNr;
                var time = 0;
                var trackLength = 0;
                var playing = false;
                var pausedTime = 0;



                var showSun = true;
                var showDisplay = false;
                var searchActive = false;
                var optionsActive = false;
                var showRecord = true;
                var showSocial = false;
                var recording = false;
                var searchText = "";
                var searchInput;
                var fs = false;

                var myFaves = 'http://api.soundcloud.com/users/' + userID + '/favorites/?client_id=' + clientID;

                var SCLogo, playButton, pauseButton, searchButton, nextButton, prevButton, optsButton, expandButton, shrinkButton;


                p.preload = function(){
                    rem = function(){
                        p.remove();
                    };
                    SC.initialize({
                        client_id: clientID
                    });
                    setTrackListFaves();
                    searchText = "Copy and paste a SoundCloud track URL here";
                    SCLogo = p.loadImage("/icons/SCLogo.png");
                    playButton = p.loadImage("/icons/playButton.png");
                    pauseButton = p.loadImage("/icons/pauseButton.png");
                    searchButton = p.loadImage("/icons/searchImg.PNG");
                    nextButton = p.loadImage("/icons/nextButton.png");
                    prevButton = p.loadImage("/icons/prevButton.png");
                    optsButton = p.loadImage("/icons/optionsButton.png");
                    expandButton = p.loadImage("/icons/expand.png");
                    shrinkButton = p.loadImage("/icons/shrink.png");
                };


                p.setup = function(){

                    setRes();
                    p.createCanvas(width, height, 'p3d');
                    p.noStroke();

                    context = new(window.AudioContext || window.webkitAudioContext);

                    //Create a Stream-Instance audio via audiostreamsource.js by Gregg Tavares
                    streamSource = audioStreamSource.create({
                        context: context, // a WebAudio context
                        loop: true, // true or false if you want it to loop
                        autoPlay: false, // true to autoplay (you don't want this. See below)
                        crossOrigin: true // true to try to get crossOrigin permission
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
                    playTrack(trackIDs[trackNr]);

                    //20 miliseconds = 50 updates everysecond
                    setInterval(sampleAudioStream, 16);   //analyse stream every 16 milliseconds
                    searchInput = p.createInput();
                    searchInput.position(40,20);
                    searchInput.addClass("hidden");
                };

                p.sampleAudioStream = sampleAudioStream;
                function sampleAudioStream(){
                    analyser.getByteFrequencyData(streamData)
                }

                p.windowResized = resize;
                function resize(){
                    setRes();
                    p.resizeCanvas(width, height);
                }

                function setRes(){
                    fs = p.fullscreen();
                    height = window.innerHeight * 0.8;
                    width = document.body.clientWidth * 0.8;

                }

                function setTrackListFaves(){
                    p.loadJSON(myFaves, buildTrackList);
                }

                function search() {
                    SC.get('/resolve', {url: searchText}, function (sound) {
                        console.log(sound);
                    });
                }

                function buildTrackList (data) {
                    var streamCount = 0;
                    for (var i = 0; i < data.length; i++) {
                        if(data[i].streamable){
                            trackIDs[streamCount] = data[i].id;
                            trackNames[streamCount] = data[i].title;
                            extLink[streamCount] = data[i].permalink_url;
                            //console.log(data[i]);
                            streamCount++;
                        }
                    }
                }

                function playTrack(id){
                    var src = 'http://api.soundcloud.com/tracks/' + id + '/stream?client_id=' + clientID;
                    streamSource.setSource(src); // init src to play
                }

                function inRange(x, y){
                    return(x> 0 && x < width && y > 0 && y < height);
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
                    var w = 5;
                    var s = (width/2)/(Math.max(1 ,streamData.length-5));
                    var c = {'r': 255, 'g': 128, 'b': 128, 'a': 60};
                    for(var i  = 0; i < streamData.length-1; i+=5){

                        var y1 = streamData[i];
                        var y2 = streamData[i+1];

                        p.noStroke();
                        reflectBot(s*i,y1,s*(i+1), y2, c);

                    }
                }

                function aurora(){
                    var s  = (width/2)/(streamData.length + 50);
                    var y_scale = 1/3;

                    var gmax = 100*Math.cos(time)

                    var y_pos = height/2.5;
                    //aurora(i, 255.0*sin(i*.05), 100.0, 0.0, floor(200*sin(10*PI*t/gmax)));
                    for(var i = 0; i < streamData.length; i++) {

                        var r = 255.0*Math.sin(time *.5+i*.05);
                        var g = 100*Math.cos(time+i*0.05);
                        var b = 100*Math.tan(time-i*0.5);
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
                    var s = Math.sin(time*0.5);

                    p.stroke(0);
                    p.fill(Math.random()*255, 222, Math.random()*255, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[0], 2*time, false);
                    p.fill(31, 182, 222, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[1], 2*time, true);
                    p.fill(200, 180, 0, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[2], Math.PI+2*time, true);
                    p.fill(222, 31, 31, 100);
                    ring(width/2.0, height/2.0, 3, ring_radius[3], 2*time, true);
                    p.fill(218, 222, 31, 150);
                    ring(width/2.0, height/2.0, 6, ring_radius[4], time, true);
                    p.fill(229, 35, 35, 100);
                    ring(width/2.0, height/2.0, 11, 125, time, true);
                    p.fill(229, 136, 35, 100);
                    ring(width/2.0, height/2.0, 10, 125, -time, true);
                    p.fill(239, 255, 67, 100);
                    ring(width/2.0, height/2.0, 12, 125, 1.5*time, true);
                    p.fill(255, 255, 255, 10);
                    ring(width/2.0, height/2.0, 6, ring_radius[5], time, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 2, 1.1*time, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 4, 1.2*time, true);
                    ring(width/2.0, height/2.0, 6, ring_radius[5] + 6, 1.3*time, true);
                    p.fill(0, 0, 0, 0);
                    p.stroke(255);
                    //equalizerRing(width/2.0, height/2.0, num_bars, t);
                    //ring(width/2.0, height/2.0, 100, 177.5, -.75*t+2*s, false);
                    //ring(width/2.0, height/2.0, 100, 175, -.75*t+2*s + Math.PI/100, true);
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
                    var r = 50*Math.sin(time*0.02);
                    var r2 = 50*Math.cos(2*time*0.02);
                    ring_radius[0] = 75 + r2/2;
                    ring_radius[1] = 75 + r2/3;
                    ring_radius[2] = 30 + r2/3;
                    ring_radius[3] = 8 + r2/3;
                    ring_radius[4] = 100 - r2/1.5;
                    ring_radius[5] = 46 + r/2;
                }

                p.mousePressed = function(){pressed(p.mouseX, p.mouseY);};

                p.touchStarted = function(){pressed(p.touchX, p.touchY);};

                p.mouseMoved = function(){Hover = inRange(p.mouseX, p.mouseY);};

                p.touchMoved = function(){Hover = inRange(p.touchX, p.touchY);};

                p.keyPressed = function(){
                    if(p.keyCode == 83){//keycode for s
                        showSun = !showSun;
                    } else {
                        //console.log(p.keyCode);
                    }
                };

                function pressed(x, y){
                    if(inRange(x, y)) {
                        interactDisplay(x, y);
                    } else {
                        if(playing){
                            pause();
                            playing = !playing;
                        }
                    }
                }

                function pause(){
                    streamSource.stop();
                    pausedTime = streamSource.getCurrentTime();
                }

                function play(){
                    streamSource.play();
                }

                function interactDisplay(x, y) {
                    //logo
                    var logow = SCLogo.width;
                    var logoh = SCLogo.height;
                    if (showDisplay) {
                        var buttonSize = 32;
                        //options button
                        if (x >= 0 && x <= buttonSize && y >= 0 && y <= buttonSize) {
                            //console.log("options button pressed");
                            optionsActive = !optionsActive;
                        }

                        if(optionsActive){
                            var textSize = 20;
                            var maxLen = 16;
                            var maxEntries = Math.floor((height-textSize*3/4)/(textSize))-2;
                            for(var i = 0; i < maxEntries; i++) {
                                if(x >= 8
                                && x <= 8 + textSize * maxLen * 2 / 3
                                && y >= 15 - textSize + textSize * (i + 2)
                                && y <= 15 + textSize * (i + 2)){
                                        trackNr = (trackNr + 1 + i) % trackIDs.length;
                                        playTrack(trackIDs[trackNr]);

                                }
                            }
                        }

                        //search button
                        if (x >= width-buttonSize && x <= width && y >= 0 && y <= buttonSize) {
                            //console.log("search button pressed");
                            searchActive = !searchActive;
                        }
                        //clicked on the bottom row
                        if (y>=height-buttonSize&&y<=height) {
                            if (x >= width / 2.0 - buttonSize / 2 && x <= width / 2.0 + buttonSize / 2) {
                                if (playing) {
                                    //console.log("Pause the track");
                                    pause();
                                } else {
                                   // console.log("Play the track");
                                    play();
                                }
                            } else if (x >= width / 2.0 - 3 * buttonSize / 2.0 && x <= width / 2.0 - buttonSize / 2) {
                               //console.log("previous track");
                                trackNr = (trackNr-1)%trackIDs.length;
                                playTrack(trackIDs[trackNr]);
                            } else if(x>=width / 2.0 + buttonSize / 2.0&&x<=width / 2.0 + 3*buttonSize / 2){
                                //console.log("next track");
                                trackNr = (trackNr+1)%trackIDs.length;
                                playTrack(trackIDs[trackNr]);
                            } else if(x >= width/2.0+5*buttonSize/2&& x<= width/2.0+7*buttonSize/2){
                                recording = !recording;
                            }else if(x >= width/2.0-7*buttonSize/2 && x <= width/2.0-5*buttonSize/2){
                                showSocial = !showSocial;
                            } else if(x>=0 && x <= buttonSize){
                                p.fullscreen(!fs);
                                fs = !fs;
                            }
                        }

                    }

                    if(x>=width-logow && x<= width && y >= height-logoh && y < height){
                        window.open(extLink[trackNr]);
                    }
                }


                function displayInterface(){
                    if(showDisplay){
                        //track title
                        p.noFill();
                        p.stroke(0);
                        var textSize = 20;
                        p.textSize(textSize);
                        var buttonSize = 32;
                        p.image(optsButton, 0, 0, buttonSize, buttonSize);
                        p.image(searchButton, width-buttonSize, 0, buttonSize, buttonSize);
                        if(searchActive){
                            searchInput.removeClass("hidden");

                        } else {
                            searchInput.addClass("hidden");

                            p.text(trackNames[trackNr], 40, 20);
                        }

                        //next/prev

                        p.image(prevButton, width/2.0-3*buttonSize/2.0, height-buttonSize, buttonSize, buttonSize);
                        p.image(nextButton, width/2.0+buttonSize/2.0, height-buttonSize, buttonSize, buttonSize);
                        //time seek bar
                        var start = buttonSize/2;
                        var end = width-buttonSize/2;
                        var d = end-start;
                        p.stroke(0);
                        p.line(start, height-3*buttonSize/2, end, height-3*buttonSize/2);
                        p.ellipse((time/trackLength)*d+start, height-3*buttonSize/2, 10, 10);
                        p.text(""+parseNumToTime(time)+"/"+parseNumToTime(trackLength), start,height-buttonSize);

                        //button for the dropdown track list
                        if(optionsActive){
                            var maxLen = 16;
                            var maxEntries = Math.floor((height-textSize*3/4)/(textSize))-2;
                            for(var i = 0; i < maxEntries; i++){
                                var shortTitle = trackNames[(trackNr+1+i)%trackIDs.length];
                                if(shortTitle.length > maxLen){
                                    shortTitle = shortTitle.substring(0,maxLen) + "...";
                                }
                                p.fill(255);
                                p.quad(8,15-textSize+textSize*(i+2),
                                       8,15+textSize*(i+2),
                                       8+textSize*maxLen*2/3,15+textSize*(i+2),
                                       8+textSize*maxLen*2/3,15-textSize+textSize*(i+2));
                                p.fill(0);
                                p.text(shortTitle, 10, 15+textSize*(i+2));
                            }
                        }
                        p.noFill();
                        //play/pause button
                        if(playing){
                            p.image(pauseButton, width/2.0-buttonSize/2, height-buttonSize, buttonSize, buttonSize);
                        } else {
                            p.image(playButton, width/2.0-buttonSize/2, height-buttonSize, buttonSize, buttonSize);
                        }

                        //recording button
                        if(showRecord){
                            p.noFill();
                            p.ellipse(width/2.0+3*buttonSize, height-buttonSize/2,buttonSize, buttonSize);
                            if(recording){
                                p.fill(255,0,0);
                            } else {
                                p.fill(0,0,0);
                            }
                            p.ellipse(width/2.0+3*buttonSize, height-buttonSize/2,buttonSize/4, buttonSize/4);
                        }

                        //social button
                        p.noFill();
                        p.ellipse(width/2.0-3*buttonSize, height-buttonSize/2,buttonSize, buttonSize);
                        if(showSocial){
                            p.fill(0,0,255);
                        } else {
                            p.fill(0,255,0);
                        }
                        p.ellipse(width/2.0-3*buttonSize, height-buttonSize/2, buttonSize/2, buttonSize/2);

                        if(showSocial){
                            console.log("display options for other recorded cues");
                        }

                        //fullscreen toggle button
                        if(fs){
                            p.image(shrinkButton, 0, height-buttonSize, buttonSize, buttonSize);
                        } else {
                            p.image(expandButton, 0, height-buttonSize, buttonSize, buttonSize);
                        }

                    }


                    //logo
                    var logow = SCLogo.width;
                    var logoh = SCLogo.height;
                    p.image(SCLogo, width-logow, height-logoh)
                }

                //reserved p5 method
                p.draw = function() {
                    dataUpdate();
                    p.clear();
                    p.background(255);
                    spectro();
                    if(showSun) triSunPattern();
                    aurora();
                    displayInterface();

                    //player border
                };

                p.stop = function(){
                    streamSource.stop();
                };

                function dataUpdate(){
                    if(showSun){setRingData();}
                    time = streamSource.getCurrentTime();
                    trackLength = streamSource.getDuration();
                    playing = streamSource.isPlaying();

                    if(Hover||optionsActive||searchActive||showSocial||!playing){
                        lastHover = 0;
                    }
                    showDisplay = (lastHover++ < 20);
                }

                function paste(event){
                    console.log(event);
                }

                function parseNumToTime(num){
                    var hours   = Math.floor(num / 3600);
                    var minutes = Math.floor((num - (hours * 3600)) / 60);
                    var seconds = num - (hours * 3600) - (minutes * 60);

                    if (minutes < 10) {minutes = "0"+minutes;}
                    if (seconds < 10) {seconds = "0"+seconds;}
                    var time;
                    if(hours > 0) {
                        time = hours + ':' + minutes + ':' + Math.floor(seconds);
                    } else {
                        time = minutes + ':' + Math.floor(seconds);
                    }
                    return time;
                }

            };
        }])
        .controller("ProjectController", ['$scope', '$location', ProjectController]);

    function ProjectController($scope, $location){
        $scope.$on('$routeChangeStart', function() {
            rem();
            console.log("navigated away from project page, ending the p5sketch");
        });
        console.log("project controller finished loading");
    }
})();