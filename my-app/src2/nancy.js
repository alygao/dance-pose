let video;
let video2;
let poses = [];
let poses2 = [];
let canvas;
let context;
function setup() {
  background(100);
  video = createVideo(["blackpink.mp4"], () => {
    // video.load();
    video.play();
    video.volume(0);
  });
  // video2 = createVideo(["2_blackpink.mp4"], () => {
  //   video2.play();
  //   video2.volume(0);
  // });
  createCanvas(406, 720);
  canvas =  document.getElementById("myCanvas");
  context = canvas.getContext('2d');
  video.size(width, height);
  // video2.size(width, height);
  poseNet = ml5.poseNet(video, () => {
    console.log("Model 1 is ready");
  });
  // Listen to new 'pose' events
  poseNet.on("pose", function(results) {
    poses = results;
    drawSkeleton();
    drawKeypoints();
    stopVideo();
  });

  // poseNet2 = ml5.poseNet(video2, () => {
  //   console.log("Model 2 is ready");
  // });
  // // Listen to new 'pose' events
  // poseNet2.on("pose", function(results) {
  //   poses2 = results;
  //   drawSkeleton();
  //   drawKeypoints();
  // });

  // poseNet.removeListener('pose', function() {
  //   video.remove();
  // });
  // poseNet2.removeListener('pose', stopVideo(video2));
  // video.hide();
  // video2.hide();
  // video.onended(stopVideo(video));
  // video2.onended(stopVideo(video2));
}

function stopVideo (video) {
  video.remove();
}

// function draw() {
//   console.log("in draw()")
//   // image(video, 0, 0, width, height);
//   drawSkeleton();
//   drawKeypoints();
//   // drawPose();
// }

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
        fill(142, 165, 226);
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
      stroke(142, 165, 226);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

export Video;