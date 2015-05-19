$(function() {

var $columnNumbers = $('.JS-ColumnNumbers');
var $rowNumbers = $('.JS-RowNumbers');
var mainField = $('.JS-MainField').get(0);
var mainFieldCell = $('.JS-MainField-Cell', mainField).get(0);

$columnNumbers.click(function(event) {
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

$rowNumbers.click(function(event) {
    if ($(event.target).is('.JS-RowNumbers-Cell:first-child')) {
        $('.JS-RowNumbers-Row', this).each(function() {
            this.insertBefore(event.target.cloneNode(), this.firstChild);
        });
    }
    var lastRow = $('.JS-RowNumbers-Row', this).last().get(0);
    if (event.target.parentNode === lastRow) {
        lastRow.parentNode.appendChild(lastRow.cloneNode(true));
        console.log(mainField);
        console.log($('.JS-MainField-Row', mainField).get(0));

        mainField.appendChild($('.JS-MainField-Row', mainField).get(0).cloneNode(true));
    }
});

});