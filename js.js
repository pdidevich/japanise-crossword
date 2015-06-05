var crossword = {};

/* -> ColumnNumbers (X)
  |
  V
  rowNumbers (Y)
*/
$(function() {

var NUMBERS_IN_CELL = 2;

var $columnNumbers = $('.JS-ColumnNumbers');
var $rowNumbers = $('.JS-RowNumbers');
var mainField = $('.JS-MainField').get(0);
var mainFieldCell = $('.JS-MainField-Cell', mainField).get(0);

function addXRow() {
    var firstRow = $('.JS-ColumnNumbers-Row', $columnNumbers).first().get(0);
    firstRow.parentNode.insertBefore(firstRow.cloneNode(true), firstRow);
}

function addXColumn() {

    $('.JS-ColumnNumbers-Row', $columnNumbers).each(function() {
        this.appendChild($('.JS-ColumnNumbers-Cell:last-child').get(0).cloneNode());
    });
    $('.JS-MainField-Row', mainField).each(function() {
        this.appendChild(mainFieldCell.cloneNode());
    })
}

function addYRow() {
    var lastRow = $('.JS-RowNumbers-Row', $rowNumbers).last().get(0);
    lastRow.parentNode.appendChild(lastRow.cloneNode(true));
    mainField.appendChild($('.JS-MainField-Row', mainField).get(0).cloneNode(true));
}

function addYColumn() {
    $('.JS-RowNumbers-Row', $rowNumbers).each(function() {
        this.insertBefore($('.JS-RowNumbers-Cell', $rowNumbers).get(0).cloneNode(), this.firstChild);
    });
}

crossword.makeNumbers = function() {
    $columnNumbers.on('click keyup', function(event) {
        if ($(event.target).is('.JS-ColumnNumbers-Cell:last-child')) {
            addXColumn();
        }
        if (event.target.parentNode === $('.JS-ColumnNumbers-Row', this).get(0)) {
            addXRow();
        }
    });

    var focusInterval;
    $('.JS-ColumnNumbers').on('focus', '.JS-ColumnNumbers-Cell', function(event) {
        focusInterval = window.setInterval(function() {
            var tempHTML = event.target.innerHTML.replace(/[^0-9]/g, '').slice(0, 2);
            if (event.target.innerHTML !== tempHTML) {
                event.target.innerHTML = tempHTML;
            }
        }, 1000);
    })

    $('.JS-ColumnNumbers').on('blur', '.JS-ColumnNumbers-Cell', function(event) {
        if (focusInterval) {
            window.clearInterval(focusInterval);
        }
    })

    $rowNumbers.on('click keyup', function(event) {
        if ($(event.target).is('.JS-RowNumbers-Cell:first-child')) {
            addYColumn();
        }
        var lastRow = $('.JS-RowNumbers-Row', this).last().get(0);
        if (event.target.parentNode === lastRow) {
            addYRow();
        }
    });


    $('.JS-Save').click(save);
}

crossword.loadNumbers = function() {
    var numbers = JSON.parse(localStorage.getItem('crosswordNumbers'));

    generateColumnNumbersEmptyField(numbers.x);
    var xRows = $('.JS-ColumnNumbers-Row', $columnNumbers);
    for (var i = 0, l = numbers.x.length; i < l; i ++) {
        for (var j = numbers.x[i].length-1; j >= 0; j--) {
            $('.JS-ColumnNumbers-Cell', xRows[xRows.length - numbers.x[i].length + j])[i].innerHTML = numbers.x[i][j];
        }
    }

    generateRowsNumbersEmptyField(numbers.y);
    var yRows = $('.JS-RowNumbers-Row', $rowNumbers);
    var xCellsNumber = $('.JS-RowNumbers-Cell', yRows[0]).length;
    for (var i = 0, l = numbers.y.length; i < l; i++) {
        for (var j = numbers.y[i].length-1; j >= 0; j--) {
            $('.JS-RowNumbers-Cell', yRows[i])[xCellsNumber - numbers.y[i].length + j].innerHTML = numbers.y[i][j];
        }
    }
}

function generateColumnNumbersEmptyField(x) {
    var maxRowsNumber = 0;
    for (var i = 1, l = x.length; i < l; i ++) {
        addXColumn();
        maxRowsNumber = Math.max(maxRowsNumber, x[i].length);
    }
    for (var i = 1, l = maxRowsNumber; i < l; i++) {
        addXRow();
    }
}

function generateRowsNumbersEmptyField(y) {
    var maxCellsNumber = 0;
    for (var i = 1, l = y.length; i < l; i ++) {
        addYRow();
        maxCellsNumber = Math.max(maxCellsNumber, y[i].length);
    }
    for (var i = 1, l = maxCellsNumber; i < l; i++) {
        addYColumn();
    }
}

crossword.solvePage = function() {
    $(mainField).click(function(event) {
        switch ($(event.target).attr('filled')) {
            case 'true':
                $(event.target).attr('filled', 'false');
                $(event.target).css('background-color', 'grey');
                break;
            case 'false':
                $(event.target).attr('filled', 'unknown');
                $(event.target).css('background-color', 'white');
                break;
            default:
                $(event.target).attr('filled', 'true');
                $(event.target).css('background-color', 'black');
        }
    })
}

function getCurrentRowArray(rowNumber) {
    var $cells = $('.JS-MainField-Cell', $('.JS-MainField-Row', $('.JS-MainField'))[rowNumber]);
    var arr = [];
    for (var i = 0, l = $cells.length; i < l; i++) {
        $currentSquare = $($cells[i]);
        switch ($currentSquare.attr('filled')) {
            case 'false':
                arr.push(0);
                break;
            case 'unknown':
            case undefined:
                arr.push(undefined);
                break;
            default:
                arr.push(1);
        }
    }
    return arr;
}

crossword.solveRowByNumber = function(number) {
    var numbers = JSON.parse(localStorage.getItem('crosswordNumbers'));
    var $mainField = $('.JS-MainField');
    var $mainFieldRows = $('.JS-MainField-Row', $mainField);

    console.log(numbers.y[number]);
    var lines = fillCrossLine(numbers.y[number], getCurrentRowArray(number));
    console.log(lines);
    var $squares = $('.JS-MainField-Cell', $mainFieldRows[number]);
    for (var j = 0, m = lines.length; j < m; j++) {
        var $currentSquare = $($squares[j])
        switch (lines[j]) {
            case 0:
                $currentSquare.attr('filled', 'false');
                $currentSquare.css('background-color', 'grey');
                break;
            case undefined:
                $currentSquare.attr('filled', 'unknown');
                $currentSquare.css('background-color', 'white');
                break;
            default:
                $currentSquare.attr('filled', 'true');
                $currentSquare.css('background-color', 'black');
        }
    }
}

crossword.solveRows = function() {
    var numbers = JSON.parse(localStorage.getItem('crosswordNumbers'));
    for (var i = 0, l = numbers.y.length; i < l; i++) {
        crossword.solveRowByNumber(i);
    }
}

function getCurrentColumnArray(columnNumber) {
    var $rows = $('.JS-MainField-Row', $('.JS-MainField'));
    var arr = [];
    for (var i = 0, l = $rows.length; i < l; i++) {
        $currentSquare = $($('.JS-MainField-Cell', $rows[i])[columnNumber]);
        switch ($currentSquare.attr('filled')) {
            case 'false':
                arr.push(0);
                break;
            case 'unknown':
            case undefined:
                arr.push(undefined);
                break;
            default:
                arr.push(1);
        }
    }
    return arr;
}

crossword.solveColumnByNumber = function(number) {
    var numbers = JSON.parse(localStorage.getItem('crosswordNumbers'));
    var $mainField = $('.JS-MainField');
    var $mainFieldRows = $('.JS-MainField-Row', $mainField);

    console.log(getCurrentColumnArray(number));
    var lines = fillCrossLine(numbers.x[number], getCurrentColumnArray(number));
    console.log(lines);
    for (var j = 0, m = lines.length; j < m; j++) {
        var $currentSquare = $($('.JS-MainField-Cell', $mainFieldRows[j])[number]);
        switch (lines[j]) {
            case 0:
                $currentSquare.attr('filled', 'false');
                $currentSquare.css('background-color', 'grey');
                break;
            case undefined:
                $currentSquare.attr('filled', 'unknown');
                $currentSquare.css('background-color', 'white');
                break;
            default:
                $currentSquare.attr('filled', 'true');
                $currentSquare.css('background-color', 'black');
        }
    }
}

crossword.solveColumns = function() {
    var numbers = JSON.parse(localStorage.getItem('crosswordNumbers'));
    for (var i = 0, l = numbers.x.length; i < l; i++) {
        crossword.solveColumnByNumber(i);
    }
}

function save() {
    var rows = $('.JS-ColumnNumbers-Row');
    var cells;
    var result = {'x': [], 'y': []};
    var value;

    for (var i = 0, l = rows.length; i < l; i++) {
        cells = $('.JS-ColumnNumbers-Cell', rows[i]);
        for (var j = 0, m = cells.length; j < m; j++) {
            value = cells[j].innerHTML.replace(/[^0-9]/g, '');
            if (value === '') {
                continue;
            }
            if (result.x[j] === undefined) {
                result.x[j] = [];
            }
            result.x[j].push(value);

        }
    }

    rows = $('.JS-RowNumbers-Row');
    for (var i = 0, l = rows.length; i < l; i++) {
        cells = $('.JS-RowNumbers-Cell', rows[i]);
        for (var j = 0, m = cells.length; j < m; j++) {
            value = cells[j].innerHTML.replace(/[^0-9]/g, '');
            if (value === '') {
                continue;
            }
            if (result.y[i] === undefined) {
                result.y[i] = [];
            }
            result.y[i].push(value);
        }
    }

    //JSON.stringify(result);
    $('.JS-Save-Json-Text').val(JSON.stringify(result));
    localStorage.setItem('crosswordNumbers', JSON.stringify(result));
    //return JSON.stringify(result);
}

function parseStringToArr(string) {
    var line = string.split('//');
    var resultArray = [];
    for (var i = 0, l = line.length; i < l; i++) {
        resultArray[i] = line[i].split('/');;
    }
    return resultArray;
}

function getResultFromStrings(xString, yString) {
    return {
        'x': parseStringToArr(xString),
        'y': parseStringToArr(yString)
    };
}
crossword.saveStringsToStorage = function(xString, yString) {
    localStorage.setItem('crosswordNumbers', JSON.stringify(getResultFromStrings(xString, yString)));
}

$('.JS-Save-Json-Text').val(localStorage.getItem('crosswordNumbers'));
$('.JS-Save-Json-Button').click(function() {
    localStorage.setItem('crosswordNumbers', $('.JS-Save-Json-Text').val())
});

$('.JS-Save-FromString-Button').click(function() {
    console.log($('.JS-Save-FromString-X').val(), $('.JS-Save-FromString-Y').val());
    var result = getResultFromStrings($('.JS-Save-FromString-X').val(), $('.JS-Save-FromString-Y').val());
    $('.JS-Save-Json-Text').val(JSON.stringify(result));
    localStorage.setItem('crosswordNumbers', JSON.stringify(result));
});


});
