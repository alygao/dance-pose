let video;
let song;
let poseNet;
let poses = [];

var countdown;
var countdown_number;

function preload() {
    song = loadSound('blackpink.mp4');
}

function setup() {
  canvas = createCanvas(1024, 600);
  video = createCapture(VIDEO);
  video.size(width, height);
  canvas.center();

//   song = preload('blackpink.mp4');

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  

//   song.ended = function() {
//     song.onended(ended);
//   }
}

function rectangle() {
    stroke(255);
    fill(255,255,255,100);
    rect(70,70,60,60,10);
  }

function startRecording() {
    document.getElementById("button-to-record").disabled = true;
    try {

        if (song) {
          // song.resume();
          setTimeout(50000);
            song.play();
            if (!song.isPlaying()) {
              console.log('sound finished playing');
            }
        }
    } catch (e) {
  
    }
}

function ended() {
    console.log('sound finished playing');
            // returns 'sound finished playing' as soon as I load the sketch
}

// function mousePressed() {
//     // song.play();
    
//     try {

//         if (song.isPlaying()) {
//             // .isPlaying() returns a boolean
//             song.stop();
//             // background(255, 0, 0);
//         } else {
//             song.play();
//             song.setVolume(1);
//         //   background(0, 255, 0);
//         }
//     } catch (e) {

//     }
// }

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
    translate(width,0);
    scale(-1, 1);
    image(video, 0, 0, width, height);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(142, 165, 226);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(142, 165, 226);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}