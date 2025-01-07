const constants = require('../common/constants.js');
const featureFunctions = require('../common/featureFunctions.js');
const utils = require('../common/utils.js');

const fs = require('fs');

console.log("EXTRACTING FEATURES...");

const samples = JSON.parse(
    fs.readFileSync(constants.SAMPLES)
);
// Load all samples by excluding outlier points
// ).filter( s => s.id != 3107);

for (const sample of samples) {
    // Find features in files
    const paths = JSON.parse(
        fs.readFileSync(
            constants.JSON_DIR + "/" + sample.id + ".json"
        )
    );

    // Get feature functions
    const functions = featureFunctions.inUse.map(f => f.function);

    // extract features
    sample.point = functions.map(f => f(paths));
    // After implementing `getWith` and `getheight` feature function we don't need below functions
    // sample.point = [
    //     featureFunctions.getPathCount(paths),
    //     featureFunctions.getPointCount(paths)
    // ];
}

// Add labels to the features
const featureNames = featureFunctions.inUse.map(f => f.name);
// Get feature names from the featureFunctions.inUse array
// const featureNames = [
//     "Path Count",
//     "Point Count"
// ];

// Split examples
console.log("GENERATING SPLITS...");

// Set the training amount of items to 50%
const trainingAmount = samples.length * 0.5;

// Define empty array for training and testing data
const training = [];
const testing = [];

// Loop through all samples
for (let i = 0; i < samples.length; i++) {
    // If iterator is less than the training amount value
    if (i < trainingAmount) {
        // add the current element to the training set
        // the first half of samples will be the training set
        training.push(samples[i]);
    } else {
        // the sedond half will be the testing set
        testing.push(samples[i]);
    }
}

const minMax = utils.normalizePoints(
    // Normalize all data
    // samples.map(s => s.point)
    // Normalize only the training data
    training.map(t => t.point)
);

// Normalize the testing data using the minMax values from the training data
utils.normalizePoints(testing.map(t => t.point), minMax);

fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featureNames,
        samples: samples.map(s => {
            return {
                point: s.point,
                label: s.label
            }
        })
    })
);

fs.writeFileSync(constants.FEATURES_JS,
    `const features = ${JSON.stringify({ featureNames, samples })};`
);

fs.writeFileSync(constants.TRAINING,
    JSON.stringify({
        featureNames,
        samples: training.map(s => {
            return {
                point: s.point,
                label: s.label
            }
        })
    })
);

fs.writeFileSync(constants.TRAINING_JS,
    `const training = ${JSON.stringify({ featureNames, samples: training })};`
);

fs.writeFileSync(constants.TESTING,
    JSON.stringify({
        featureNames,
        samples: testing.map(s => {
            return {
                point: s.point,
                label: s.label
            }
        })
    })
);

fs.writeFileSync(constants.TESTING_JS,
    `const testing = ${JSON.stringify({ featureNames, samples: testing })};`
);

// Write the min and max normalized values in one of the JS files so we can reuse them to the drawing canvas
fs.writeFileSync(constants.MIN_MAX_JS,
    `const minMax= ${JSON.stringify(minMax)};`
);

console.log("DONE");