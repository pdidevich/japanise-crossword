function fillCrossLine(lineSections, crossingLine) {

    var fromLeft = fromLeftToRight(lineSections, crossingLine);
    var fromRight = fromRightToLeft(lineSections, crossingLine);
    var crossingLineEmpty = new Array(crossingLine.length);

    for (var i = 0; i < lineSections.length; i++) {
        if (fromLeft[i].end >= fromRight[i].start) {
            for (var j = fromRight[i].start; j <= fromLeft[i].end; j++) {
                crossingLine[j] = 1;
            }
        }

        // Combine fromLeft and fromRight, to check empty squares
        for (var j = fromLeft[i].start; j <= fromRight[i].end; j++) {
            crossingLineEmpty[j] = 1;
        }

        //TODO [2, 2] + [und, 1, und, und, und, 1, und] -> [und, 1, und, 0, und, 1, und]
        //TODO [1, 2] + [und, und, 1, und, und, und] -> [und, 0, 1, und, und, und]
        //TODO [3] + [und, 1, und, und, und] -> [und, 1, 1, und, und]
    }
    // Mark empty squares
    for (var i = 0, l = crossingLine.length; i < l; i++) {
        if (crossingLineEmpty[i] === undefined) {
            crossingLine[i] = 0;
        }
    }
    return crossingLine;
}

function fromLeftToRight(lineSections, crossingLine) {
    var startPosition = 0;
    var endPosition;
    var sectionsStartEnd = [];

    for (var i = 0; i < lineSections.length; i++) {
        endPosition = startPosition + lineSections[i] - 1;
        // Pass empty squares
        var emptyPosition = crossingLine.indexOf(0, startPosition);
        while (emptyPosition != -1 && emptyPosition <= endPosition) {
            startPosition = crossingLine.indexOf(0, startPosition) + 1;
            endPosition = startPosition + lineSections[i] - 1;
            emptyPosition = crossingLine.indexOf(0, startPosition);
        }
        // Catch filled squares behind last section square
        while (crossingLine[endPosition + 1] === 1) {
            endPosition++;
            startPosition++;
        }
        sectionsStartEnd[i] = {'start': startPosition, 'end': endPosition};
        startPosition = endPosition + 2;
    }
    return sectionsStartEnd;
}

function fromRightToLeft(lineSections, crossingLine) {
    var endPosition = crossingLine.length -1;
    var startPosition;
    var sectionsStartEnd = [];

    for (var i = lineSections.length - 1; i >= 0; i--) {
        startPosition = endPosition - lineSections[i] + 1;
        // Pass empty squares
        var emptyPosition = crossingLine.indexOf(0, startPosition);
        while (emptyPosition != -1 && emptyPosition <= endPosition) {
            endPosition = emptyPosition - 1;
            startPosition = endPosition - lineSections[i] + 1;
            emptyPosition = crossingLine.indexOf(0, startPosition);
        }
        // Catch filled squares behind last section square
        while (crossingLine[startPosition - 1] === 1) {
            endPosition--;
            startPosition--;
        }
        sectionsStartEnd[i] = {'start': startPosition, 'end': endPosition};
        endPosition = startPosition - 2;
    }
    return sectionsStartEnd;
}

var line = new Array(14);
line[2] = 0;

console.log(fillCrossLine([3, 3, 3], line));

