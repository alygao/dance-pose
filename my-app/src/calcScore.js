const cosSim = require('compute-cosine-similarity')

// More important body parts are weighted more
const WEIGHTINGS = [1, 3, 3, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 0, 0, 0, 0]
const WEIGHTING_SUM = 40


// Returns a value in [0, 100], where 100 is more similar
export default function calcScore(pose1, pose2) {
    // Returns array of values in [0, 1]
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

    // Returns value in [0, 1], where 1 is more similar
    function calcEucScore(cosSimArr) {
        let sum = 0;
        for (let i = 0; i < WEIGHTINGS.length; i++) {
            sum += Math.sqrt(2 * (1 - cosSimArr[i])) * WEIGHTINGS[i]
        }
        return Math.min(sum /  WEIGHTING_SUM, 1)
    }


    let cosSimArr = calcCosSimArr(pose1, pose2)
    let cosScore = calcCosScore(cosSimArr)
    let euclidScore = calcEucScore(cosSimArr)
    console.log('CosSimArr: ' + cosSimArr)
    console.log('Cosine Score: ' + cosScore)
    console.log('Euclid Score: ' + euclidScore)

    let finScore = (Math.max(0, cosScore - euclidScore) * 100).toFixed(2)
    console.log('FINAL SCORE: ' + finScore + '%')
    return finScore
}

