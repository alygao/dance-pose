const cosSim = require('compute-cosine-similarity')

const WEIGHTINGS = [1, 5, 3, 3, 0, 5, 5, 5, 0, 1, 5, 3, 0, 0, 5, 5]
const WEIGHTING_SUM = 46


export default function (pose1, pose2) {
    // Returns array of values in [0, 1]
    function calcCosSimArr(pose1, pose2) {
        let res = []
        for (let i = 0; i < WEIGHTINGS.length; i++) {
            res[i] = cosSim([pose1.keypoints[i].position.x, pose1.keypoints[i].position.y],
                [pose2.keypoints[i].position.x, pose2.keypoints[i].position.y])
        }
        return res
    }

    // Returns value in [0, 1], where 1 is more similar
    function calcCosScore(cosSimArr) {
        let sum = 0
        for (let i = 0; i < WEIGHTINGS.length; i++) {
            sum += cosSimArr[i] * WEIGHTINGS[i]
        }
        return sum / WEIGHTING_SUM
    }

    // Returns value in [0, 1], where 1 is more similar
    function calcEucScore(cosSimArr) {
        let sum = 0;
        for (let i = 0; i < WEIGHTINGS.length; i++) {
            sum += Math.sqrt(2 * (1 - cosSimArr[i]))
        }
        return sum / WEIGHTINGS.length
    }


    let cosSimArr = calcCosSimArr(pose1, pose2)
    let cosScore = calcCosScore(cosSimArr)
    let euclidScore = calcEucScore(cosSimArr)
    console.log(cosSimArr)
    console.log(cosScore)
    console.log(euclidScore)

    let finScore = Math.max(0, cosScore - euclidScore)
    console.log('FINAL SCORE: ' + finScore)
    return finScore
}

/*
const testObj = {
    keypoints: [
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
    ]
}
const testObj2 = {
    keypoints: [
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 0, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 0, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
        { position: { x: 443.168521094415, y: 556.676242472 } },
    ]
}

// leftEar: { x: 538.2757698979359, y: 284.5326933508 }, // low
// leftElbow: { x: 477.32479073194213, y: 342.3099977 }, // high
// leftEye: { x: 558.0957077078318, y: 269.9507568596 }, // medium
// leftHip: { x: 428.25435653270915, y: 469.028156443 }, // medium
// leftKnee: { x: 449.399552994665, y: 584.8815134248 },
// leftShoulder: { x: 461.4727510088613, y: 302.54500 }, // high
// leftWrist: { x: 508.072899844396, y: 310.067319164 }, // high
// nose: { x: 558.3325646545172, y: 289.5020659331682 }, // high
// rightAnkle: { x: 515.6400747336303, y: 564.9566953 }, 
// rightEar: { x: 501.84126917026384, y: 267.04704195 }, // low
// rightElbow: { x: 389.9501702572121, y: 350.6597211 }, // high
// rightEye: { x: 548.0943838631597, y: 272.355746258 }, // medium
// rightHip: { x: 440.47324510863785, y: 472.22825759 },
// rightKnee: { x: 487.93340660718627, y: 577.1417402 }, 
// rightShoulder: { x: 425.2606058677347, y: 305.4217 }, // high
// rightWrist: { x: 450.8455269067668, y: 316.3166332 }  // high
*/
