const constants = require('../common/constants.js');
const features = require('../common/features.js');

const fs = require('fs');

console.log("EXTRACTING FEATURES...");

const samples = JSON.parse(
    fs.readFileSync(constants.SAMPLES)
);

for (const sample of samples) {
    // Find features in files
    const paths = JSON.parse(
        fs.readFileSync(
            constants.JSON_DIR + "/" + sample.id + ".json"
        )
    );
    // extract features
    sample.point = [
        features.getPathCount(paths),
        features.getPointCount(paths)
    ];
}

// Add labels to the features
const featureNames = [
    "Path Count",
    "Point Count"
];

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
    `const features = ${JSON.stringify({featureNames,samples})};`
);

console.log("DONE");