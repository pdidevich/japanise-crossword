$(function() {

var NUMBERS_IN_CELL = 2;

var $columnNumbers = $('.JS-ColumnNumbers');
var $rowNumbers = $('.JS-RowNumbers');
var mainField = $('.JS-MainField').get(0);
var mainFieldCell = $('.JS-MainField-Cell', mainField).get(0);


$columnNumbers.on('click keyup', function(event) {
    if ($(event.target).is('.JS-ColumnNumbers-Cell:last-child')) {
        $('.JS-ColumnNumbers-Row', this).each(function() {
            this.appendChild(event.target.cloneNode());
        });
        $('.JS-MainField-Row', mainField).each(function() {
            this.appendChild(mainFieldCell.cloneNode());
        })
    }
    var firstRow = $('.JS-ColumnNumbers-Row', this).first().get(0);
    if (event.target.parentNode === firstRow) {
        firstRow.parentNode.insertBefore(firstRow.cloneNode(true), firstRow);
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
        $('.JS-RowNumbers-Row', this).each(function() {
            this.insertBefore(event.target.cloneNode(), this.firstChild);
        });
    }
    var lastRow = $('.JS-RowNumbers-Row', this).last().get(0);
    if (event.target.parentNode === lastRow) {
        lastRow.parentNode.appendChild(lastRow.cloneNode(true));
        mainField.appendChild($('.JS-MainField-Row', mainField).get(0).cloneNode(true));
    }
});

$(mainField).click(function(event) {
    console.log($(event.target).attr('filled'));
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

$('.JS-Save').click(save);

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

    JSON.stringify(result);
    console.log(JSON.stringify(result));
    return JSON.stringify(result);
}

});