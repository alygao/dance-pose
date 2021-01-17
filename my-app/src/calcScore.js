const cosSim = require('compute-cosine-similarity')

// More important body parts are weighted more
const WEIGHTINGS = [1, 3, 3, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 0, 0, 0, 0]
const WEIGHTING_SUM = 40


// Takes in two arrays of poses to compare
export default function calcPoseArrScore(poseArr1, poseArr2) {
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
    function getHighlights(poseScoreArr){
        if (poseScoreArr.length <= 1) { // choose no best/worst moments
            return {
                maxes: {},
                mins: {}
            }
        } else { // choose 1 best and 1 worst moment
            let min = { score: Number.MAX_SAFE_INTEGER, ind: -1}
            let max = { score: Number.MIN_SAFE_INTEGER, ind: -1}
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
    console.log('HIGHLIGHTS BEST: '+ highlights.maxes.score + ' WORST: '+ highlights.mins.score)

    return {
        score: finScore,
        highlights: highlights
    }
}