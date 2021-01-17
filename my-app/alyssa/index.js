// Takes in two arrays of poses to compare
async function calcPoseArrScore(poseArr1, poseArr2) {
  const WEIGHTINGS = [1, 3, 3, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 0, 0, 0, 0]   // More important body parts are weighted more
  const WEIGHTING_SUM = 40

  // Calculates cosine similarity
  function cosSim(pair1, pair2) {
    return (pair1[0] * pair2[0] + pair1[1] * pair2[1]) / ((Math.sqrt(Math.pow(pair1[0], 2) + Math.pow(pair1[1], 2)))
      * (Math.sqrt(Math.pow(pair2[0], 2) + Math.pow(pair2[1], 2))))
  }

  // Returns array of values, each in [0, 1]
  function calcCosSimArr(pose1, pose2) {
    let res = []
    for (let i = 0; i < WEIGHTINGS.length; i++) {
      // Normalize vectors and calc cosSimilarity
      let denom1 = Math.sqrt(Math.pow(pose1.keypoints[i].position.x, 2) + Math.pow(pose1.keypoints[i].position.y, 2))
      let denom2 = Math.sqrt(Math.pow(pose2.keypoints[i].position.x, 2) + Math.pow(pose2.keypoints[i].position.y, 2))
      res[i] = cosSim([Math.pow(pose1.keypoints[i].position.x, 2) / denom1, Math.pow(pose1.keypoints[i].position.y, 2) / denom1],
        [Math.pow(pose2.keypoints[i].position.x, 2) / denom2, Math.pow(pose2.keypoints[i].position.y, 2) / denom2])
    }
    res = res.map(x => Math.min(x, 1))
    return res
  }

  // Returns value in [0, 1], where 1 is more similar
  function calcCosScore(cosSimArr) {
    let sum = 0
    for (let i = 0; i < WEIGHTINGS.length; i++) {
      sum += cosSimArr[i] * WEIGHTINGS[i]
    }
    return Math.min(sum / WEIGHTING_SUM, 1)
  }

  // Returns value in [0, 1], where 0 is more similar
  function calcEucScore(cosSimArr) {
    let sum = 0;
    for (let i = 0; i < WEIGHTINGS.length; i++) {
      sum += Math.sqrt(2 * (1 - cosSimArr[i])) * WEIGHTINGS[i]
    }
    return Math.min(sum / WEIGHTING_SUM, 1)
  }

  // Returns a value in [0, 1], where 1 is more similar
  function calcPoseScore(pose1, pose2) {
    let cosSimArr = calcCosSimArr(pose1, pose2)
    let cosScore = calcCosScore(cosSimArr)
    let euclidScore = calcEucScore(cosSimArr)
    // console.log('CosSimArr: ' + cosSimArr)
    // console.log('Cosine Score: ' + cosScore)
    // console.log('Euclid Score: ' + euclidScore)

    return Math.max(0, cosScore - euclidScore)
  }

  // Takes an array of calculated poseScores
  // Returns the most and least similar poseComparisons
  function getHighlights(poseScoreArr) {
    if (poseScoreArr.length <= 1) { // choose no best/worst moments
      return {
        maxes: {},
        mins: {}
      }
    } else { // choose 1 best and 1 worst moment
      let min = { score: Number.MAX_SAFE_INTEGER, ind: -1 }
      let max = { score: Number.MIN_SAFE_INTEGER, ind: -1 }
      for (let i = 0; i < poseScoreArr.length; i++) {
        if (poseScoreArr[i] < min.score) {
          min.score = poseScoreArr[i]
          min.ind = i
        }
        if (poseScoreArr[i] > max.score) {
          max.score = poseScoreArr[i]
          max.ind = i
        }
      }

      min.score = (min.score * 100).toFixed(2)
      max.score = (max.score * 100).toFixed(2)
      return {
        maxes: max,
        mins: min
      }
    }
  }


  let minLen = Math.min(poseArr1.length, poseArr2.length)
  let poseScoreArr = []
  let finScore = 0
  for (let i = 0; i < minLen; i++) {
    let s = calcPoseScore(poseArr1[i], poseArr2[i])
    poseScoreArr[i] = s
    finScore += s
  }
  finScore = (finScore / minLen * 100).toFixed(2)
  console.log('FINAL SCORE: ' + finScore)

  let highlights = getHighlights(poseScoreArr)
  console.log('HIGHLIGHTS BEST: ' + highlights.maxes.score + ' WORST: ' + highlights.mins.score)

  return {
    score: finScore,
    highlights: highlights
  }
}




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

const LIMIT = 5
let counter = 0
let oneTimeTrigger = true
let poseArr1 = []
let poseArr2 = []

function drawKeypoints()  {
  for (let i = 0; i < poses.length; i++) {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    
    let pose = poses[i].pose;
    if (counter++ < LIMIT) {
      poseArr1.push(pose)
      console.log(pose)
    } else if (oneTimeTrigger) {
      calcPoseArrScore(poseArr1, poseArr1)
      oneTimeTrigger = false
    }

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

