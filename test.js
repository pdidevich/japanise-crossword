function fillCrossLine(lineSections, crossingLine) {

    var fromLeft = fromLeftToRight(lineSections, crossingLine);
    var fromRight = fromRightToLeft(lineSections, crossingLine);
    var crossingLineEmpty = new Array(crossingLine.length);


    // Check last section if it catches not empty square
    var lastNumber = lineSections.length - 1;
    var lastLineSection = lineSections[lastNumber];
    var lastSectionPositionFromLeft = fromLeft[lastNumber];
    var end = fromRight[lastNumber].end;

    for (var i = end, m = end - lastLineSection + 1; i >= m; i--) {
        if (lastSectionPositionFromLeft.end >= i) {
            break;
        }
        if (crossingLine[i] === 1) {
            lastSectionPositionFromLeft.end = i;
            lastSectionPositionFromLeft.start = i - lastLineSection + 1;
            break;
        }
    }


    // Check first section if it catches not empty square
    var firstLineSection = parseInt(lineSections[0], 10);
    for (var i = fromLeft[0].start, m = fromLeft[0].start + firstLineSection; i < m; i++) {
        if (fromRight[0].start <= i) {
            break;
        }
        if (crossingLine[i] === 1) {
            fromRight[0].start = i;
            fromRight[0].end = i + firstLineSection-1;
            break;
        }
    }


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
        endPosition = startPosition + parseInt(lineSections[i], 10) - 1;
        // Pass empty squares
        var emptyPosition = crossingLine.indexOf(0, startPosition);
        while (emptyPosition != -1 && emptyPosition <= endPosition) {
            startPosition = crossingLine.indexOf(0, startPosition) + 1;
            endPosition = startPosition + parseInt(lineSections[i], 10) - 1;
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
        startPosition = endPosition - parseInt(lineSections[i], 10) + 1;
        // Pass empty squares
        var emptyPosition = crossingLine.indexOf(0, startPosition);
        while (emptyPosition != -1 && emptyPosition <= endPosition) {
            endPosition = emptyPosition - 1;
            startPosition = endPosition - parseInt(lineSections[i], 10) + 1;
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

