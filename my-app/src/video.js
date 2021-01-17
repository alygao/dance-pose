import * as poseNet from '@tensorflow-models/posenet';
import * as ml5 from 'ml5';
import * as p5 from 'p5';

function Video(props) {
    let video = props.video;
    let poses = [];
    let canvas;

function cheese (results) {
  poses = results;
}

function setup() {
  video = p5.createVideo(["blackpink.mp4"], () => {
    video.play();
    video.volume(0);
  });
  canvas = p5.createCanvas(406, 720);
  video.size(406, 720);
  poseNet = ml5.poseNet(video, () => {
    console.log("Model is ready");
  });
  // Listen to new 'pose' events
  poseNet.on("pose", cheese);
  // video.hide();
}

function draw() {
  drawSkeleton();
  drawKeypoints();
}

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    // context.clearRect(0, 0, canvas.width, canvas.height);
    let pose = poses[i].pose;
    console.log(pose)
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        canvas.fill(255, 0, 0);
        canvas.noStroke();
        canvas.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}


// A function to draw the skeletons
function drawSkeleton() {
  canvas = p5.createCanvas(406, 720);
  // Loop through all the skeletons detected
  // context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      canvas.stroke(255, 0, 0);
      canvas.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

return;
}

export default Video;
