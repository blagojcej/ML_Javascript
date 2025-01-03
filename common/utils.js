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

utils.getNearest = (loc, points) => {
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
}

if (typeof module !== 'undefined') {
    module.exports = utils;
}