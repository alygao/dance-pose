let video;
let poses = [];
let canvas;
function setup() {
  createCanvas(406, 720);
  canvas =  document.getElementById("myCanvas");
  // const context = canvas.getContext('2d');
  video = createVideo(["renegade.mp4"], () => {
    video.loop();
    video.volume(0);
  });
  video.size(width, height);
  poseNet = ml5.poseNet(video, () => {
    console.log("Model is ready");
  });
  // Listen to new 'pose' events
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // video.hide();
}

function draw() {
  // image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton();
}

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // canvas.clearRect(0,0, canvas.width, canvas.height);
    // For each pose detected, loop through all the keypoints
    // context.clearRect(0, 0, canvas.width, canvas.height);
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        // noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       strokeWeight(4);
//       line(
//         partA.position.x,
//         partA.position.y,
//         partB.position.x,
//         partB.position.y
//       );
//     }
//   }
// }

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}