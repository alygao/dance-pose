let video;
let video2;
let poses = [];
let poses2 = [];
let canvas;
let context;
function setup() {
  video = createVideo(["renegade.mp4"], () => {
    video.loop();
    video.volume(0);
  });
  video2 = createVideo(["blackpink.mp4"], () => {
    video2.loop();
    video2.volume(0);
  });
  createCanvas(406, 720);
  canvas =  document.getElementById("myCanvas");
  context = canvas.getContext('2d');
  video.size(width, height);
  video2.size(width, height);
  poseNet = ml5.poseNet(video, () => {
    console.log("Model is ready");
  });
  // Listen to new 'pose' events
  poseNet.on("pose", function(results) {
    poses = results;
  });

  poseNet2 = ml5.poseNet(video2, () => {
    console.log("Model is ready");
  });
  // Listen to new 'pose' events
  poseNet2.on("pose", function(results) {
    poses2 = results;
  });
  // video.hide();
}

function draw() {
  console.log("in draw()")
  // image(video, 0, 0, width, height);
  drawSkeleton();
  drawKeypoints();
  // drawPose();
}

// function drawPose() {
//   for (let i = 0; i < poses.length; i++) {
//     let pose = poses[i].pose;
//     console.log(pose);
//     let skeleton = poses[i].skeleton;
//     for (let j = 0; j < pose.keypoints.length; j++) {
//        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//        let keypoint = pose.keypoints[j];
//        // Only draw an ellipse is the pose probability is bigger than 0.2
//        if (keypoint.score > 0.2) {
//          fill(255, 0, 0);
//          noStroke();
//          ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//        }
//     }
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//     createCanvas(406, 720);
//     // remove();
//   }
// }

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
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
    // canvas.clearRect(0,0, canvas.width, canvas.height);
    // setTimeout(3000)
    // remove();s

  }
}


// A function to draw the skeletons
function drawSkeleton() {
  createCanvas(406, 720);
  // Loop through all the skeletons detected
  // context.clearRect(0, 0, canvas.width, canvas.height);

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