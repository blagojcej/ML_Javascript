const draw = require('../common/draw.js');
const constants = require('../common/constants.js');
const utils = require('../common/utils.js');

const {createCanvas} = require('canvas') ;
const canvas = createCanvas(400,400);
const ctx = canvas.getContext('2d');

const fs = require('fs');

// Get file names
const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
fileNames.forEach(fn => {
    // Read the content
    const content = fs.readFileSync(
        constants.RAW_DIR + "/" + fn
    );
    // Extract the content as separate variables
    const {session, student, drawings} = JSON.parse(content);

    for (let label in drawings) {
        samples.push({
            id,
            label,
            student_name: student,
            student_id: session
        });

        // Write path drawings as a separate file
        const paths = drawings[label];
        fs.writeFileSync(
            constants.JSON_DIR + "/" + id + ".json",
            JSON.stringify(paths)
        );

        // Generate image from paths
        generateImageFile(
            constants.IMG_DIR + "/" + id + ".png",
            paths
        );

        // Multiplied by because each file contains 8 drawings 
        utils.printProgress(id, fileNames.length * 8)
        id++;
    }
});

// Write the samples array into the samples.json file
fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));

fs.writeFileSync(constants.SAMPLES_JS, "const samples=" + JSON.stringify(samples) + ";");

function generateImageFile(outFile, paths) {
    // clear the canvas before drawing new paths
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    draw.paths(ctx, paths);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}