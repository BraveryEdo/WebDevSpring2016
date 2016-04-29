import java.util.concurrent.Semaphore;
static Semaphore semaphoreExample = new Semaphore(1);
import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.ugens.*;
import ddf.minim.effects.*;
//audio processing elements
Minim minim;
AudioInput in;
FFT rfft, lfft;
//used for printing coordinates/colors/values and drawing center lines
boolean testing = false;
// GLOBAL DATA
//duplicated items ending with 2 or _mix are used to diffeentiate l/r/mix channels in effects
// test values for printing highs/lows
float llow = 100;
float hhigh = -100;
float llow2 = 100;
float hhigh2 = -100;
float llow_mix = 100;
float hhigh_mix = -100;

int pattern = 0;
int num_patt = 1;
int sample_rate = 4096;
//int used_in = sample_rate/2 + 1;
int used_in = 300;

float t = 0;
float last_click = 0;


//fft values translated to audio levels
//current goal level
float[] levels;
float[] levels2;
float[] levels_mix;
//previous goal levels
float[] plevels;
float[] plevels2;
float[] plevels_mix;
//levels for audio bars
float[] bars;
int bar_height = 5;
//number of bins displaying audio levels
int num_bars = 100;
//number of triangles in the outer ring
int num_tri_oring = 50;
//magnitude and frequency used by the topspec function (displays peak values for the background spectrum
float[] TS_mag;
float[] TS_freq;
float[] TS_mag2;
float[] TS_freq2;
float[] TS_mag_mix;
float[] TS_freq_mix;

int hist_depth;
int curr_hist = 0;

int n_rings = 6;
float[] ring_radius;
float[] ring_rot;

//min width between peak values
int TS_w = 3;
//number of values top spec looks for
int TS_n = 60;
//spacing between each frequency for the spectrogram
float spec_x = 2.75;

int specSize;
float decay = 1.2;
float smooth = 1.12;
float gmax = 0;
float pmax = 0;
float next_seq = 5;

//graphics object we will use to buffer our drawing
PGraphics graphics;

//window dimensions
int window_x = 1900;
int window_y = 1000;


int lastCallLogic = 0; //absolute time when logic thread was called
int lastCallRender = 0; //lastCallRender
int lastCallMisc = 0;

//time passed since last call
int deltaTLogic = 0;
int deltaTRender = 0;

//how often we already called the threads
int countLogicCalls = 0;
int countRenderCalls = 0;

//used to know  how many calls since last fps calculation
int countLogicCallsOld = 0;
int countRenderCallsOld = 0;

//framerate of Logic/Render threads
//-1 to run as fast as  possible. be prepared to melt your pc!
int framerateLogic = 300;
int framerateRender = 240;

int framerateMisc = 1; //how often the framerate display will be updated




void setup() {
  hist_depth = 32;
  //init window
  // size(window_x, window_y); //creates a new window
  size(1900, 1000, P3D);
  graphics = createGraphics(window_x, window_y, P3D);//creates the draw area
  frameRate(framerateRender); //tells the draw function to run

  smooth();

  minim = new Minim(this);
  in = minim.getLineIn(Minim.STEREO, sample_rate);
  rfft = new FFT(in.bufferSize(), in.sampleRate());
  lfft = new FFT(in.bufferSize(), in.sampleRate());
  rfft.logAverages(60, 7);
  lfft.logAverages(60, 7);
  specSize = rfft.specSize();

  levels = new float[used_in];
  plevels = new float[used_in];
  levels2 = new float[used_in];
  plevels2 = new float[used_in];
  levels_mix = new float[used_in];
  plevels_mix = new float[used_in];
  bars = new float[num_bars];
  TS_freq = new float[TS_n];
  TS_mag = new float[TS_n];
  TS_freq2 = new float[TS_n];
  TS_freq_mix = new float[TS_n];
  TS_mag_mix = new float[TS_n];  
  TS_mag2 = new float[TS_n];
  ring_rot = new float[n_rings];
  ring_radius = new float[n_rings];
  
  next_seq = random(10);
  
  //start Threads
  //Start a Thread for Logic!
  //Use this one for your logic calculations!
  logicThread.start();

  //start the graphics Thread!
  //actually we render in the main Thread. opengl and lots of other render stuff want to run in the main Thread.
  //Therefore we dont start a new thread and will put the drawing into processings draw() method.
  println(Thread.currentThread().getName() +" : the MainThread is running and used to Render");

  //start the misc Thread. it counts the fps etc.
  //use this for wierd stuff like counting fps and all weird things you can think of that doesnt belong into logic nor rendering
  miscThread.start();
}

//draw function. This is our Render Thread
void draw() {

  countRenderCalls++;

  graphics.beginDraw();


  /*
      all drawing calls have to be called from the graphics object.
   so graphics.line(0,0,100,100) instead of line(0,0,100,100)
   */
  //-------------

  //CODE TO DRAW GOES HERE

  graphics.background(0);
  backgroundPattern();
  graphics.stroke(40);
  
  topSpec();


  all_rings();

  t += .002;
  last_click++;

  if (testing) {
    graphics.stroke(120);
    graphics.line(0, height/2.0, 0, width, height/2.0, 0);
    graphics.line(width/2.0, 0, 0, width/2.0, height, 0);
  }

  //-------------
  graphics.endDraw();
  image(graphics, 0, 0);
  //no sleep calculation here because processing  is doing  it for us already
}


// Create a new Thread by passing a Runnable when creating a new thread
Thread logicThread = new Thread(new Runnable() {
  public void run() {
    System.out.println(Thread.currentThread().getName() + " : the logicThread is running");
    int hist = 0;
    //main Logic loop
    while (true) {


      countLogicCalls++;
      //------------
      //CODE FOR LOGIC  GOES HERE

      //update the buffer of audio data
      
      rfft.forward(in.right);
      lfft.forward(in.left);

      // combine right and left channels, decay if a frequency has lost intensity
      for (int i = 1; i < used_in + 1; i++) {
        
        hist %= hist_depth;
        curr_hist = hist;
        
        float lband = max(0, lfft.getBand(i));
        float rband = max(0, rfft.getBand(i));
        float  band = max(0, (rband+lband)/2.0);
        
        if (testing) {
          if (band < llow_mix) {
            llow = band;
            println("new low: ", llow);
          }

          if (band > hhigh_mix) {
            hhigh = band;
            println("new high: ", hhigh);
          }
        }
        levels[i-1] -= decay;
        levels2[i-1] -= decay;
        levels_mix[i-1] -= decay;
        if (levels[i-1] < lband) levels[i-1] = lband;
        if (levels2[i-1] < rband) levels2[i-1] = rband;
        if (levels_mix[i-1] < band) levels_mix[i-1] = band;
        
        if(testing && levels[i-1] != levels2[i-1]){
           print("Bands: " + levels[i-1] + ", " + levels2[i-1] + ", " + levels_mix[i-1] + "\n"); 
        }
      }

      int top_c = 0;
      int top_c2 = 0;
      int top_c_mix = 0;
      
        // smoothing
      for (int i = 0; i < used_in; i++) {
        //left
        boolean include = false;
        float diff = levels[i]-plevels[i];
        if (diff > 0) {
          diff = max(diff/smooth, 0);
        } else {
          diff = min(-decay, diff);
        }
        plevels[i] = levels[i];
        levels[i] += diff;
        

        if (i > 0 && ((i == 1 || i == used_in-1) || //end points
        ((levels[i-1] < levels[i] && levels[i] > levels[i+1]) || // maxima
        (levels[i-1] > levels[i] && levels[i] < levels[i+1]))
          && levels[i] >= 0)) { //minima
          include = true;
        }
        
        if (levels[i] > 0 && include && top_c < TS_n) {
          if (i == 1) {
            TS_mag[top_c] = min(100, levels[i]);
            TS_freq[top_c++] = 0;
          } else {
            TS_mag[top_c] = levels[i];
            TS_freq[top_c++] = i;
          }
          i += TS_w -1;
        }
      }
      
      for (int i2 = 0; i2 < used_in; i2++) {
        
        //right
        boolean include2 = false;
        float rdiff = levels2[i2]-plevels2[i2];
        if (rdiff > 0) {
          rdiff = max(rdiff/smooth, 0);
        } else {
          rdiff = min(-decay, rdiff);
        }
        plevels2[i2] = levels2[i2];
        levels2[i2] += rdiff;
        
        if (i2 > 0 && ((i2 == 1 || i2 == used_in-1) || //end points
        ((levels2[i2-1] < levels2[i2] && levels2[i2] > levels2[i2+1]) || // maxima
        (levels2[i2-1] > levels2[i2] && levels2[i2] < levels2[i2+1]))
          && levels2[i2] >= 0)) { //minima
          include2 = true;
        }
        

        if (levels2[i2] > 0 && include2 && top_c2 < TS_n) {
          if (i2 == 1) {
            TS_mag2[top_c2] = min(100, levels2[i2]);
            TS_freq2[top_c2++] = 0;
          } else {
            TS_mag2[top_c2] = levels2[i2];
            TS_freq2[top_c2++] = i2;
          }
          i2 += TS_w - 1;
        }
      }
      
      for (int im = 0; im < used_in; im++) {
        
         //mix
        boolean include_mix = false;
        float mdiff = levels_mix[im]-plevels_mix[im];
        if (mdiff > 0) {
          mdiff = max(mdiff/smooth, 0);
        } else {
          mdiff = min(-decay, mdiff);
        }
        plevels_mix[im] = levels_mix[im];
        levels_mix[im] += mdiff;
        
        
        if (im > 0 && ((im == 1 || im == used_in-1) || //end points
        ((levels_mix[im-1] < levels_mix[im] && levels_mix[im] > levels_mix[im+1]) || // maxima
        (levels_mix[im-1] > levels_mix[im] && levels_mix[im] < levels_mix[im+1]))
          && levels_mix[im] >= 0)) { //minima
          include_mix = true;
        }
        
        if (levels_mix[im] > 0 && include_mix && top_c_mix < TS_n) {
          if (im == 1) {
            TS_mag_mix[top_c_mix] = min(100, levels_mix[im]);
            TS_freq_mix[top_c_mix++] = 0;
          } else {
            TS_mag_mix[top_c_mix] = levels_mix[im];
            TS_freq_mix[top_c_mix++] = im;
          }
          im += TS_w - 1;
        }
    
      }

      float max = 0;
      float min = 99999;
      float avg = 0;
      float navg = 0;
      int q = 0;

      for (int i = 1; i < num_bars; i++) {
        navg++;
        float l = bars[i];
        if (l > max) {
          q = i;
        }
        avg += l;
        max = max(l, max);
        min = min(l, min);
      }
      avg /= navg;  
      pmax = max(pmax-(gmax-pmax)/3.0, pmax - decay/3.0);
      gmax = max;

      if(last_click > 2000){
        if (avg > 30 ||gmax > 60) {
          pattern = 0;
        } else if (gmax < 50 && t%next_seq <= 0.03) {
          pattern = floor(random((num_patt + 1)))%num_patt;
          next_seq = ((int)random(200) + 1)*0.02;
          if (testing) {
            print("Equalizer bar's pattern switched to: " + pattern + " next switch in: " + next_seq +" units\n");
          }
        }
      } else if(testing){
         print("last_click < 2000: " + last_click + "\n"); 
      }

      num_patt = 5;
      if (pattern == 0) {
        //spectrum
        for (int i = 0; i < num_bars; i++) {
          bars[i] = levels_mix[i];
        }
      } else if (pattern == 1) {
        // wave traverse the bars
        for (int i = 0; i < num_bars; i++) {
          bars[i] = 100*sin(2*t+3*i);
        }
      } else if (pattern == 2) {
        // alternating bar heights (0 or 100)
        for (int i = 0; i < num_bars; i++) {
          bars[i] = 100*(i%2);
        }
      } else if (pattern == 3) {
        // all max bar height
        for (int i = 0; i < num_bars; i++) {
          bars[i] = 100;
        }
      } else if (pattern == 4) {
        // alternating bar heights (40 or 60)
        for (int i = 0; i < num_bars; i++) {
          bars[i] = 40+20*(i%2);
        }
        max = 80;
      } else if (pattern == 5) {
        /*  for (int m = 0; m < TS_freq.length-1; m++) {
         int x1 = (int) (TS_freq[m] + 1);
         float f1 = TS_mag[m]; 
         int x2 = (int) (TS_freq[m+1] + 1);
         float f2 = TS_mag[m+1];
         int mx = (x1+x2)/2;
         float mf = (f1+f1)/2;
         for (int i = x1; i < x2; i++) {
         if (i > mf) {
         } else {
         }
         }
         }*/
      }

      float r = 50*sin(t);
      float r2 = 50*cos(2*t);
      ring_radius[0] = 75 + r2/2;
      ring_radius[1] = 75 + r2/3; 
      ring_radius[2] = 30 + r2/3; 
      ring_radius[3] = 8 + r2/3;
      ring_radius[4] = 100 - r2/1.5;
      ring_radius[5] = 46 + r/2;


      //------------
      //framelimiter
      int timeToWait = 1000/framerateLogic - (millis()-lastCallLogic); // set framerateLogic to -1 to not limit;
      if (timeToWait > 1) {
        try {
          //sleep long enough so we aren't faster than the logicFPS
          Thread.currentThread().sleep( timeToWait );
        }
        catch ( InterruptedException e )
        {
          e.printStackTrace();
          Thread.currentThread().interrupt();
        }
      }
      hist++;
      lastCallLogic = millis();
      //End of main logic loop
    }
  }
}
);


// Passing a Runnable when creating a new thread
Thread miscThread = new Thread(new Runnable() {
  public void run() {
    System.out.println(Thread.currentThread().getName() + " : the miscThread is running");
    //main misc loop
    while (true) {
      //fps calculation here
      frame.setTitle("logicFPS: " + (countLogicCalls-countLogicCallsOld) +" RenderFps: " + (countRenderCalls-countRenderCallsOld)); //Set the frame title to the frame rate
      countLogicCallsOld = countLogicCalls;
      countRenderCallsOld =countRenderCalls;

      //framelimiter
      int timeToWait = 1000/framerateMisc - (millis()-lastCallMisc); // set to -1 to not limit
      if (timeToWait > 1) {
        try {
          //sleep long enough so we aren't faster than the logicFPS
          Thread.currentThread().sleep( timeToWait );
        }
        catch ( InterruptedException e )
        {
          e.printStackTrace();
          Thread.currentThread().interrupt();
        }
      }
      lastCallMisc = millis();
    }
  }
}
);
float last_rad = 1000;
float last_t = 0;
// makes a ring equalizer that displays the levels array on bars number of outputs
void equalizerRing(float _x, float _y, int nbars, float t) {
  
  float s = sin(t);
  
  float pad = 50;

  float o_rot = -.75*t+2*s;
  float i_rad = 187-5*s;
  float o_rad = max((200-7*s+gmax), (200-7*s+pmax));
  graphics.stroke(255);
  ring(_x, _y, nbars, i_rad, o_rot, false);
  bars(_x, _y, i_rad, 187-5*s, gmax, 0);//o_rot);
  graphics.stroke(255);
  
  
  o_rad = last_rad + (o_rad-last_rad)/10;
  if(o_rad < last_rad){
     o_rad+= 1;
  } 
  
  
  graphics.noFill();
  graphics.pushMatrix();
  graphics.translate(_x, _y, 0);
  graphics.rotateX(sin(t+90));
  ring(0, 0, num_tri_oring, o_rad+pad, o_rot, true);
  graphics.popMatrix();
  
  
  graphics.pushMatrix();
  graphics.translate(_x, _y, 0);
  graphics.rotateX(sin(-(t+90)));
  ring(0, 0, num_tri_oring, o_rad+pad, -o_rot, true);
  graphics.popMatrix();
  
  
  graphics.pushMatrix();
  graphics.translate(_x, _y, 0);
  graphics.rotateY(sin(t+90));
  ring(0, 0, num_tri_oring, o_rad+pad, o_rot, true);
  graphics.popMatrix();
  
  graphics.pushMatrix();
  graphics.translate(_x, _y, 0);
  graphics.rotateY(sin(-(t+90)));
  ring(0, 0, num_tri_oring, o_rad+pad, -o_rot, true);
  graphics.popMatrix();
  
  last_rad = o_rad;
}

void bars(float _x, float _y, float low, float min, float max, float rot) {

  float angle = TWO_PI / num_bars;
  float a = 0;
  float mult = 1;

  if (max < 50 && max > 12) {
    mult = 55/max;
  }

  float s = (low*PI/num_bars)*.8;
  graphics.rectMode(CENTER);

  graphics.pushMatrix();
  graphics.translate(_x, _y);
  graphics.rotate(rot);
  for (int i = 0; i < num_bars; i ++) {
    graphics.pushMatrix();
    graphics.rotateZ(a);
    float r = random(255);
    float b = random(255);
    float g = random(255);
    float z = random(5); 
    for (int j = 0; j < bars[i]*mult; j+= bar_height) {
      graphics.stroke(r-j, b-j, g-j, 120+z*j);
      graphics.rect(0, s+low + j, s, s*2/3);
    }
    graphics.popMatrix();
    a+= angle;
  }
  graphics.popMatrix();
}
float spec_running = 0;
void spectrum() {
  int w = 1; 
  float s_pos = height/2.5;
  
  spec_running+=gmax/10000.0;
  for (int i = 0; i < used_in-w; i+=w) {
    float s = spec_x;
    float s2 = 5;
    if(i*s > 2*width/5.0) break;
    //top left
    if(gmax > 65){
      float r =  255-200*sin(i*t);
      float g =  255-200*sin(2*i);
      float b = 255-200*sin(4*i-t);
      //floor(200*sin(8*PI*t/gmax))
      float alph = 255*sin(spec_running)-150*sin(i*0.005);
      if(alph <= 0) break; 
      graphics.stroke(r, g, b, alph);
      graphics.fill(r, g, b, ceil(75*sin(PI*t))-s*i);
    } else if(gmax > 35){
      spec_running *= .5;
      //graphics.stroke(40-random(10)+3*sin(t));
      float alph = 25+100*sin(PI*t)-100*sin(i*0.005);
      if(alph <= 0) break; 
      graphics.stroke(255*sin(t),255*sin(t+60),255*sin(t+120), alph);
    } else if(pattern == 0){
      spec_running *= .75;
      break; 
    }
    
    float y1 = height-s_pos;
    float y12 = plevels[i]*s2;
    if(y12 > 100){ 
      y12 = min( y12*.5, height/6.0);
    }
    float y2 = plevels[i+w]*s2;
    if(y2 > 100){
      y2 = min( y2*.5, height/6.0);
    }
    //left
    graphics.beginShape();
    graphics.vertex(s*i, y1, 0);
    graphics.vertex(s*i, y1-y12, 0);
    graphics.vertex(s*i, y1-y12, 0);
    graphics.vertex(s*(i+w), y1-y2, 0);
    
    graphics.vertex(s*i, y1, 0);
    graphics.vertex(s*i, y1+y12, 0);
    graphics.vertex(s*i, y1+y12, 0);
    graphics.vertex(s*(i+w), y1+y2, 0);
    graphics.endShape(CLOSE);
    
    //right
    //graphics.beginShape();
    graphics.beginShape();
    graphics.vertex(width-s*i, y1, 0);
    graphics.vertex(width-s*i, y1-y12, 0);
    graphics.vertex(width-s*i, y1-y12, 0);
    graphics.vertex(width-s*(i+w), y1-y2, 0);
    
    graphics.vertex(width-s*i, y1, 0);
    graphics.vertex(width-s*i, y1+y12, 0);
    graphics.vertex(width-s*i, y1+y12, 0);
    graphics.vertex(width-s*(i+w), y1+y2, 0);
    graphics.endShape(CLOSE);
  }
}


void topSpec() {
  float s = spec_x;
  float s2 = 7;
  
  
  spectrum();
  
  for (int i = 0; i < TS_n-1; i++) {

    TS_mag_mix[i+1] = TS_mag_mix[i+1]/2.75;
    TS_mag2[i+1] = TS_mag2[i+1]/2.75;
    TS_mag[i+1] = TS_mag[i+1]/2.75;

    float tr = 255*sin(i*0.5) - random(5)*i;//255-random(2)*i
    float tb = random(255);
    float tg = random(255);

    float br = 255*sin(PI-i*0.25) + random(5)*i;//255-random(5)*i
    float bb = random(255);
    float bg = random(255);

    float ba  = random(80)+95-i*2;
    float ta = random(110)+55;
    
     
    if (gmax > 25 && i < TS_n*1/2) {  
      aurora(i, 255.0*sin(i*.05), 100.0, 0.0, floor(200*sin(10*PI*t/gmax)));
    }
    
    if (gmax > 35 && i < TS_n/4  && (t%4 > 3)) {
      aurora_spread(i, 255.0*sin(t*10), 255*sin((random(1)-1)*-t*10), 255.0*cos(PI*t/7), 100*sin(i*0.2)+100.0, floor(gmax/20));
    }

    fourLine(i, tr, tb, tg, ta, br, bb, bg, ba);

    TS_mag[i]--;
    TS_mag2[i]--;
    TS_mag_mix[i]--;
  }
  TS_mag[TS_n-1]--;
  TS_mag2[TS_n-1]--;
  TS_mag_mix[TS_n-1]--;
}

//another bars effect, this time more bouncy and fades
void aurora(int i, float tr, float tb, float tg, float ta) {
  float s = spec_x;
  float s2 = 7;
  float max_y = height/7.0;
  float y_pos = height/2.5;
  
  float lx1 = TS_freq[i]*s;
  float ly1 = min(max_y, TS_mag[i]*s2+18*sin(t));
  float rx1 = TS_freq2[i]*s;
  float ry1 = min(max_y, TS_mag2[i]*s2+10*PI*i/gmax*sin(t));
  
  graphics.stroke(tr, tb, tg, ta);
  //left
  graphics.line(lx1, y_pos + sin(t), 0, lx1, y_pos-ly1, 0);
  graphics.line(lx1, y_pos + 1- sin(t), 0, lx1,y_pos+ly1, 0);
  //right
  graphics.line(width-rx1, y_pos + sin(t), 0, width-rx1,y_pos-ry1, 0);
  graphics.line(width-rx1, y_pos + 1 -sin(t), 0, width-rx1, y_pos+ry1, 0);
}

//hit em with da lazer beams
void aurora_spread(int ind, float tr, float tb, float tg, float ta, int reps) {
  float s = spec_x*gmax/100.0;
  float s2 = 7;
  
  float lx1 = TS_freq[ind]*s;
  float ly1 = TS_mag[ind]*s2;
  float lx2 = TS_freq[ind+1]*s;
  float ly2 = TS_mag[ind+1]*s2;
  
  float rx1 = TS_freq2[ind]*s;
  float ry1 = TS_mag2[ind]*s2;
  float rx2 = TS_freq2[ind+1]*s;
  float ry2 = TS_mag2[ind+1]*s2;
  
  graphics.stroke(tr, tb, tg, ta);
  graphics.fill(tr*4.0/5.0,tb,tg,ta*2.0/3.0);
  //left
  for (int i = 0; i < reps; i++) {
    graphics.pushMatrix();
    graphics.translate(lx1, height/3.0-10.0*sin(lx1+20*t), 0);
    graphics.rotateZ((90*i+20*sin(2*t)) * ly2/ly1);
    graphics.beginShape(TRIANGLES);
    graphics.vertex(0, 0, 0);
    graphics.vertex(0, ly1*((i+1)*3/reps), 0.0);
    graphics.vertex(0, ly1*((i+1)*3/reps),-3*i*sin(t));
    graphics.endShape(CLOSE);
    graphics.popMatrix();
  }
  //right
  for (int i = 0; i < reps; i++) {
    graphics.pushMatrix();
    graphics.translate(width-rx1, height/3.0-10.0*sin(rx1+20*t), 0);
    graphics.rotateZ((90*i+20*sin(2*t)) * ry2/ry1);
    graphics.beginShape(TRIANGLES);
    graphics.vertex(0, 0, 0);
    graphics.vertex(0, ry1*((i + 1)*3/reps), 0.0);
    graphics.vertex(0, ry1*((i + 1)*3/reps), -i*sin(t));
    graphics.endShape(CLOSE);
    graphics.popMatrix();
    
  }
}


void fourLine(int i, float tr, float tb, float tg, float ta, float br, float bb, float bg, float ba) {
  float s = spec_x;
  float s2 = 20;
  float max_y = 200;
  
  float lx1 = TS_freq[i]*s;
  float ly1 = min(max_y, TS_mag[i]*s2);
  float lx2 = TS_freq[i+1]*s;
  float ly2 = min(max_y, TS_mag[i+1]*s2);
  
  float rx1 = TS_freq2[i]*s;
  float ry1 = min(max_y, TS_mag2[i]*s2);
  float rx2 = TS_freq2[i+1]*s;
  float ry2 = min(max_y, TS_mag2[i+1]*s2);
  //bottom left
  graphics.stroke(br, bb, bg, ba);

  graphics.line(lx1, height, 0, lx1, height-ly1, 0);
  graphics.line(lx1, height-ly1, 0, lx2, height-ly2, 0);

  //top left
  graphics.stroke(tr, tb, tg, ta);

  graphics.line(lx1, 0, 0, lx1, ly1, 0);
  graphics.line(lx1, ly1, 0, lx2, ly2, 0);

  //bottom right
  graphics.stroke(br, bb, bg, ba);

  graphics.line(width-rx1, height, 0, width-rx1, height-ry1, 0);
  graphics.line(width-rx1, height-ry1, 0, width-rx2, height-ry2, 0);

  //top right
  graphics.stroke(tr, tb, tg, ta);

  graphics.line(width-rx1, 0, 0, width-rx1, ry1, 0);
  graphics.line(width-rx1, ry1, 0, width-rx2, ry2, 0);
}


//creates a ring of outward facing triangles
void ring(float _x, float _y, int _n, float _r, float rot, Boolean ori) {
  // _x, _y = center point
  // _n = number of triangles in ring
  // _r = radius of ring (measured to tri center point)
  // ori = orientation true = out, false = in
  if (testing) {
    println("\nring: ", _x, ", ", _y, " #", _n, " radius:", _r);
  }

  float rads = 0;
  float s = (_r*PI/_n)*.9;
  float diff = TWO_PI/_n; 

  graphics.pushMatrix();
  graphics.translate(_x, _y, 0);
  graphics.rotateZ(rot);
  for (int i = 0; i < _n; i++) {
    float tx = sin(rads)*_r;
    float ty = cos(rads)*_r;
    tri(tx, ty, 0, rads, s, ori);
    rads += diff;
  }
  graphics.popMatrix();
}

void all_rings() {
  float s = sin(t);

  graphics.stroke(0);  
  graphics.fill((int) random(255), 222, random(255), 100);
  ring(width/2.0, height/2.0, 3, ring_radius[0], 2*t, false);
  graphics.fill(31, 182, 222, 100);
  ring(width/2.0, height/2.0, 3, ring_radius[1], 2*t, true);
  graphics.fill(200, 180, 0, 100);
  ring(width/2.0, height/2.0, 3, ring_radius[2], PI+2*t, true);
  graphics.fill(222, 31, 31, 100);
  ring(width/2.0, height/2.0, 3, ring_radius[3], 2*t, true);
  graphics.fill(218, 222, 31, 150);
  ring(width/2.0, height/2.0, 6, ring_radius[4], t, true);
  graphics.fill(229, 35, 35, 100);
  ring(width/2.0, height/2.0, 11, 125, t, true);
  graphics.fill(229, 136, 35, 100);
  ring(width/2.0, height/2.0, 10, 125, -t, true);
  graphics.fill(239, 255, 67, 100);
  ring(width/2.0, height/2.0, 12, 125, 1.5*t, true);
  graphics.fill(255, 255, 255, 10);
  ring(width/2.0, height/2.0, 6, ring_radius[5], t, true);
  ring(width/2.0, height/2.0, 6, ring_radius[5] + 2, 1.1*t, true);
  ring(width/2.0, height/2.0, 6, ring_radius[5] + 4, 1.2*t, true);
  ring(width/2.0, height/2.0, 6, ring_radius[5] + 6, 1.3*t, true);
  graphics.fill(0, 0, 0, 0);
  graphics.stroke(255);
  equalizerRing(width/2.0, height/2.0, num_bars, t);
  ring(width/2.0, height/2.0, 100, 177.5, -.75*t+2*s, false);
  ring(width/2.0, height/2.0, 100, 175, -.75*t+2*s + PI/100, true);
}

void backgroundPattern() {
  //scale edited to 10x10 at screen dimensions to 15x15 at 1.5x dimensions to reduce edge clipping problems during large volume sweeps
    int hn = 15;
    float hx = 1.5*height/hn;
    int wn = 15;
    float wx = 1.5*width/wn;
    int q  = 1;
    float s = sin(t);
    graphics.pushMatrix();
    graphics.translate(0, 0, 50-.1*max((200-7*s+gmax), (200-7*s+pmax)));
    for (float i = -hx - frameCount%(2*hx); i < (hn + 1)*hx; i += hx) {
      
      graphics.noFill();
  
      
      for (int j = 0; j < wn; j++) {
        float w = j * wx;
        
        graphics.stroke(sin(7.0*gmax*i)*255, sin(t)*222, 77*sin(t)+55, random(100, 200));

        if (q % 2 == 0) {
          
         // graphics.fill(128, 0, random(30,128), 255-hx*i);
          //graphics.line(w, i, 0, w, i + hx);
          graphics.line(w, i + hx, 0,  w + wx, (2 * i + hx)/2, 0);
          graphics.line(w + wx, (2 * i + hx)/2, 0, w, i, 0);
          //graphics.triangle(w, i, w, i + hx, w + wx, (2 * i + hx)/2);
        } else {
          //graphics.triangle(w + wx, i, w + wx, i + hx, w, (2 * i + hx)/2);
          
          graphics.line(w, i + hx, 0, w + wx, (2 * i + hx)/2, 0);
          graphics.line( w, (2 * i + hx)/2, 0,  w + wx, i, 0);
        }
        q++;
      }
    }
    
    graphics.popMatrix();
}



//creates an triangle with its center at _x, _y rotated by _r
void tri(float _x, float _y, float _z, float _r, float _s, boolean ori) {
  // _x, _y, _z= center point
  // _r = rotation (radians)
  // _s = triangle size (edge length in pixels)
  // ori = determines if it starts pointed up or down

  if (testing) {
    println("triangle: ", _x, ", ", _y, " rot: ", (int) _r*360/PI, " s: ", _s, "ori: ", ori);
  }

  graphics.pushMatrix();
  graphics.translate(_x, _y, _z);

  if (ori) {
    graphics.rotateZ(PI/2.0-_r);
  } else {
    graphics.rotateZ(PI+PI/2.0-_r);
  }

  polygon(0, 0, _s, 3);
  graphics.popMatrix();
}

// for creating regular polygons
void polygon(float x, float y, float radius, int npoints) {
  float angle = TWO_PI / npoints;
  graphics.beginShape();
  for (float a = 0; a < TWO_PI; a += angle) {
    if(gmax > 180){
      graphics.stroke(random(120,220), random(255), random(30, 210), random(100, 200));
    }
    float sx = x + cos(a) * radius;
    float sy = y + sin(a) * radius;
    graphics.vertex(sx, sy, 0);
  }
  graphics.endShape(CLOSE);
}

void mouseClicked() {
  pattern = (pattern + 1)%num_patt; //(int) random(num_patt);
  last_click = 0;
}

void stop() {
  in.close();
  minim.stop();
}

