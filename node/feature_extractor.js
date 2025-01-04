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

const minMax = utils.normalizePoints(
    samples.map(s => s.point)
);

// Add labels to the features
const featureNames = featureFunctions.inUse.map(f => f.name);
// Get feature names from the featureFunctions.inUse array
// const featureNames = [
//     "Path Count",
//     "Point Count"
// ];

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

// Write the min and max normalized values in one of the JS files so we can reuse them to the drawing canvas
fs.writeFileSync(constants.MIN_MAX_JS,
    `const minMax= ${JSON.stringify(minMax)};`
);

console.log("DONE");