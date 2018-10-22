var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { groupBy, mapValues, reduce, values } from "lodash";
export function pt(n) {
    return n * 2;
}
export function em(n) {
    return n * 12;
}
/** Calc Position in either direction
 * @param gap - Margin between grid rows/cols
 * @param cells - Measure type for rows/cols
 * @param size - Total Width / Height
 * @param maxColRowSize - Maximum col or row size of actual placed item
 *
 */
function calcCellPositions(gap, cells, size, maxColRowSize) {
    var remain = size - (cells.length - 1) * gap;
    // track the total of the "fr" unit
    var totalFr = 0;
    var accumulatedWidth = cells.reduce(function (p, cell, i) {
        if (maxColRowSize[i] === undefined) {
            // console.log(`Missing ${i}`, maxColRowSize);
            return p;
        }
        if (typeof cell === "number") {
            p += cell;
        }
        else if (cell === "auto") {
            p += maxColRowSize[i] || 0;
        }
        else if (typeof cell === "string") {
            var cellStr = cell.trim();
            if (cellStr.slice(-2) === "fr") {
                var freeStr = cellStr.slice(0, -2);
                var freeV = parseFloat(freeStr);
                totalFr += freeV;
            }
            else if (cellStr.slice(-1) === "%") {
                var percentStr = cellStr.slice(0, -1);
                var percent = parseFloat(percentStr);
                p += (percent * remain) / 100;
            }
        }
        return p;
    }, 0);
    var free = remain - accumulatedWidth;
    var position = 0;
    var positions = cells.map(function (cell, _i) {
        var rowColIndex = _i + 1;
        if (maxColRowSize[_i] === undefined) {
            // console.log(`Missing skipping ${_i}`, maxColRowSize);
            return position;
        }
        if (typeof cell === "number") {
            position += cell + gap;
            return position;
        }
        else if (cell === "auto") {
            position += (maxColRowSize[rowColIndex] || 0) + gap;
        }
        else if (typeof cell === "string") {
            var cellStr = cell.trim();
            if (cellStr.slice(-2) === "fr") {
                var freeStr = cellStr.slice(0, -2);
                var freeV = parseFloat(freeStr);
                // console.log(`total ${position}: fr:${cell[0]} total:${totalFr} free:${free}`);
                position += (freeV / totalFr) * free + gap;
            }
            else if (cellStr.slice(-1) === "%") {
                var percentStr = cellStr.slice(0, -1);
                var percent = parseFloat(percentStr);
                position += (percent * remain) / 100 + gap;
            }
        }
        return position;
    });
    return [0].concat(positions);
}
function getMaxRowColCells(layout, children) {
    // for children placed in one cell (start/end)
    // get the maximum child width/height
    // return a mapped rows/columns array with a correspond array of max
    var placedChildrenCol = children.filter(function (c) { return (!c.columnEnd || c.columnStart === c.columnEnd + 1); });
    var placedChildrenRow = children.filter(function (c) { return (!c.rowEnd || c.rowStart === c.rowEnd + 1); });
    var placedChildrenByColumn = groupBy(placedChildrenCol, function (p) { return p.columnStart; });
    var rowWidthMaxByCol = mapValues(placedChildrenByColumn, function (rows, k, o) {
        return rows.reduce(function (p, row) { return Math.max(p, (row.style && row.style.width) || 0); }, 0);
    });
    var placedChildrenByRow = groupBy(placedChildrenRow, function (p) { return p.rowStart; });
    var colHeightMaxByRow = mapValues(placedChildrenByRow, function (cols, k, o) {
        return cols.reduce(function (p, col) { return Math.max(p, (col.style && col.style.height) || 0); }, 0);
    });
    return { rowWidthMaxByCol: rowWidthMaxByCol, colHeightMaxByRow: colHeightMaxByRow };
}
function getRowColPositions(layout, children) {
    var _a = getMaxRowColCells(layout, children), rowWidthMaxByCol = _a.rowWidthMaxByCol, colHeightMaxByRow = _a.colHeightMaxByRow;
    var rowTemplate = typeof layout.rows === "string" ? layout.rows.split(" ") : layout.rows;
    var rows = calcCellPositions(layout.rowGap, rowTemplate, layout.height, rowTemplate.map(function (row, i) { return colHeightMaxByRow[i + 1]; }));
    var colTemplate = typeof layout.columns === "string" ? layout.columns.split(" ") : layout.columns;
    var columns = calcCellPositions(layout.columnGap, colTemplate, layout.width, colTemplate.map(function (col, i) { return rowWidthMaxByCol[i + 1]; }));
    return { rows: rows, columns: columns };
}
export function getSizePositions(layout, children) {
    var _a = getRowColPositions(layout, values(children)), rows = _a.rows, columns = _a.columns;
    return reduce(children, function (p, c, k) {
        var _a;
        var rowStart = c.rowStart - 1;
        var rowEnd = (c.rowEnd || c.rowStart + 1) - 1;
        var colStart = c.columnStart - 1;
        var colEnd = (c.columnEnd || c.columnStart + 1) - 1;
        return __assign({}, p, (_a = {}, _a[k] = {
            opacity: 1,
            top: rows[rowStart],
            height: rows[rowEnd] - layout.rowGap - rows[rowStart],
            left: columns[colStart],
            width: columns[colEnd] - layout.columnGap - columns[colStart]
        }, _a));
    }, {});
}
//# sourceMappingURL=layout.js.map