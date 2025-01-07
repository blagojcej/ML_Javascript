const utils = {};

utils.flaggedUsers = [
    1663882102141,
    1663900040545,
    1664485938220
];

utils.styles = {
    car: { color: 'gray', text: '🚗' },
    fish: { color: 'red', text: '🐠' },
    house: { color: 'yellow', text: '🏠' },
    tree: { color: 'green', text: '🌳' },
    bicycle: { color: 'cyan', text: '🚲' },
    guitar: { color: 'blue', text: '🎸' },
    pencil: { color: 'magenta', text: '✏️' },
    clock: { color: 'lightgray', text: '🕒' },
};
utils.styles["?"] = { color: 'red', text: '❓'};

utils.formatPercent = (n) => {
    return (n * 100).toFixed(2);
}

utils.printProgress = (count, max) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const percent = utils.formatPercent(
        count / max
    );
    process.stdout.write(count + "/" + max + " (" + percent + "%)");
}

utils.groupBy = (objArray, key) => {
    const groups = {};
    for (let obj of objArray) {
        const val = obj[key];
        // If the student is just identified, we don't have any drawing from this student
        if (groups[val] == null) {
            groups[val] = [];
        }
        groups[val].push(obj);
    }
    return groups;
}

utils.distance = (p1, p2) => {
    return Math.sqrt(
        (p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2
    );
}

utils.getNearest = (loc, points, k = 1) => {
    /* Used before we've implemented the k value

    // Set the min distance value as maximum integer value
    let minDist = Number.MAX_SAFE_INTEGER;
    // nearest element index is 0
    let nearestIndex = 0;

    // loop through each point
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        // calculate tthe distance between the current point and the point location from the function parameter
        // using the Pythagorean theorem (the function above)
        const d = utils.distance(loc, point);

        // if the calculated distance e less than the previous minimum distance 
        // (the maximum integer value at the beginning)
        // set that distance as minimim distance and get the index of the current point
        if (d < minDist) {
            minDist = d;
            nearestIndex = i;
        }
    }
    return nearestIndex;
    
    */

    // Get objects from our data points
    const obj = points.map((val, ind) => {
        return {ind, val};
    });

    // Sort the `obj` values
    // Sort in the way that the nearest one is the first
    const sorted = obj.sort((a, b) => {
        return utils.distance(loc, a.val) - utils.distance(loc, b.val);
    });

    // Get only the indexes
    const indices = sorted.map((obj) => obj.ind);

    // Return the k nearest values (By default its the first one)
    return indices.slice(0, k);
}

utils.invLerp = (a, b, v) => {
    return (v - a) / (b - a);
}

// Change the points values to be between 0 and 1
utils.normalizePoints = (points, minMax) => {
    // Two dimensions
    let min, max;

    // Extract dimensions
    const dimensions = points[0].length;

    // If we're passing min and max values as a function paramater, we don't need to calculate them
    if (minMax) {
        min = minMax.min;
        max = minMax.max;
    } else {
        // Create a new array with values so we can not accidentally change them later
        // Set the values of the first point at the beginning
        min = [...points[0]];
        max = [...points[0]];

        for (let i = 1; i < points.length; i++) {
            // Loop through dimensions
            for (let j = 0; j < dimensions; j++) {
                // Get the minimum value of the current point (i) and the current dimension of the current poin (j)
                min[j] = Math.min(min[j], points[i][j]);
                max[j] = Math.max(max[j], points[i][j]);
            }
        }
    }

    // Transform our data by iterating through all points
    for (let i = 0; i < points.length; i++) {
        // Loop through all dimensions in each point
        for (let j = 0; j < dimensions; j++) {
            // Modify values of each point to be between 0 and 1
            // by substracting the minimum value and divide the difference (the Inverse Lerp function)
            // Between min and max for the current dimension covert it to percentage
            points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
        }
    }

    return { min, max };
}

utils.normalizePointsStd = (points) => {
    console.log(points);
    const dimensions = points[0].length;
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < dimensions; j++) {
            points[i][j] =
                points[i][j] - utils.mean(...points.map((p) => p[j])) / utils.standardDeviation(...points.map((p) => p[j]));
        }
    }
};

utils.mean = (...inputs) => {
    let sum = 0;
    for (let input of inputs) {
        sum += input;
    }
    return sum / inputs.length;
};

utils.standardDeviation = (...inputs) => {
    const m = utils.mean(...inputs);
    let sum = 0;
    for (let input of inputs) {
        sum += (input - m) ** 2;
    }
    return Math.sqrt(sum / (inputs.length - 1));
};

if (typeof module !== 'undefined') {
    module.exports = utils;
}