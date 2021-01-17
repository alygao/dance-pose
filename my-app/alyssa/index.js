let video;
let poses = [];

function test(event) {
    var file = this.files[0]
    // var type = file.type
    var videoNode = document.querySelector('video')
    

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }

function onSubmit(event) {
    event.preventDefault();
    //localFileVideoPlayer();
    test(event);
    // make the video display block
}

function cheese (results) {
  poses = results;
}

function setup(asset) {
    video = createVideo([asset], () => {
        video.play();
        video.volume(0);
      });
    
  createCanvas(406, 720);

  //video.size(width, height);
  poseNet = ml5.poseNet(video, () => {
    console.log("Model is ready");
  });
  // Listen to new 'pose' events
  poseNet.on("pose", cheese);
  // video.hide();
}

function draw() {
  // console.log("in draw()")
  // image(video, 0, 0, width, height);
  drawSkeleton();
  drawKeypoints();
  // drawPose();
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
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
    // canvas.clearRect(0,0, canvas.width, canvas.height);
    // setTimeout(3000)
    // remove();s
    //setTimeout( poseNet.removeListener("pose", cheese), 15000);
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

(function localFileVideoPlayer() {
	'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    // var videoNode = document.querySelector('video')
    // var canPlay = videoNode.canPlayType(type)
    // if (canPlay === '') canPlay = 'no'
    // var message = 'Can play type "' + type + '": ' + canPlay
    // var isError = canPlay === 'no'
    // displayMessage(message, isError)

    // if (isError) {
    //   return
    // }

    var fileURL = URL.createObjectURL(file)

    setup(fileURL);
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
})()

