import { Dictionary, groupBy, mapValues, reduce, values } from "lodash";
// import * as React from "react";

export function pt(n: number) {
    return n * 2;
}

export function em(n: number) {
    return n * 12;
}

export type UnitType = number | string | "auto";

export interface ILayout {
    width: number;
    height: number;
    rows: UnitType[] | string;
    rowGap: number;
    columns: UnitType[] | string;
    columnGap: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface ILayoutBase {
    style: IStyle;
    columnStart: number;
    columnEnd?: number;
    rowStart: number;
    rowEnd?: number;
    onMeasured?: (size: ISize) => void;
}

export interface ISizePosition {
    left?: number;
    width?: number;
    top?: number;
    height?: number;
}

export interface IStyle extends ISizePosition {
    opacity?: number;
}

/** Calc Position in either direction
 * @param gap - Margin between grid rows/cols
 * @param cells - Measure type for rows/cols
 * @param size - Total Width / Height
 * @param maxColRowSize - Maximum col or row size of actual placed item
 *
 */
function calcCellPositions(gap: number, cells: UnitType[], size: number, maxColRowSize: Array<number | undefined>) {
    const remain = size - (cells.length - 1) * gap;
    // track the total of the "fr" unit
    let totalFr = 0;
    const accumulatedWidth = cells.reduce<number>((p, cell, i) => {
        if (maxColRowSize[i] === undefined) {
            // console.log(`Missing ${i}`, maxColRowSize);
            return p;
        }
        if (typeof cell === "number") {
            p += cell;
        } else if (cell === "auto") {
            p += maxColRowSize[i] || 0;
        } else if (typeof cell === "string") {
            const cellStr = cell.trim();
            if (cellStr.slice(-2) === "fr") {
                const freeStr = cellStr.slice(0, -2);
                const freeV = parseFloat(freeStr);
                totalFr += freeV;
            } else if (cellStr.slice(-1) === "%") {
                const percentStr = cellStr.slice(0, -1);
                const percent = parseFloat(percentStr);
                p += (percent * remain) / 100;
            }
        }
        return p;
    }, 0);
    const free = remain - accumulatedWidth;
    let position = 0;
    const positions = cells.map((cell, _i) => {
        const rowColIndex = _i + 1;
        if (maxColRowSize[_i] === undefined) {
            // console.log(`Missing skipping ${_i}`, maxColRowSize);
            return position;
        }
        if (typeof cell === "number") {
            position += cell + gap;
            return position;
        } else if (cell === "auto") {
            position += (maxColRowSize[rowColIndex] || 0) + gap;
        } else if (typeof cell === "string") {
            const cellStr = cell.trim();
            if (cellStr.slice(-2) === "fr") {
                const freeStr = cellStr.slice(0, -2);
                const freeV = parseFloat(freeStr);
                // console.log(`total ${position}: fr:${cell[0]} total:${totalFr} free:${free}`);
                position += (freeV / totalFr) * free + gap;
            } else if (cellStr.slice(-1) === "%") {
                const percentStr = cellStr.slice(0, -1);
                const percent = parseFloat(percentStr);
                position += (percent * remain) / 100 + gap;
            }
        }
        return position;
    });
    return [0, ...positions];
}

function getMaxRowColCells(layout: ILayout, children: ILayoutBase[]) {
    // for children placed in one cell (start/end)
    // get the maximum child width/height
    // return a mapped rows/columns array with a correspond array of max

    const placedChildren = children.filter(
        c => (!c.columnEnd || c.columnStart === c.columnEnd + 1) && (!c.rowEnd || c.rowStart === c.rowEnd + 1)
    );
    const placedChildrenByColumn = groupBy(placedChildren, p => p.columnStart);
    const rowWidthMaxByCol = mapValues(placedChildrenByColumn, (rows, k, o) =>
        rows.reduce((p, row) => Math.max(p, (row.style && row.style.width) || 0), 0)
    );

    const placedChildrenByRow = groupBy(placedChildren, p => p.rowStart);
    const colHeightMaxByRow = mapValues(placedChildrenByRow, (cols, k, o) =>
        cols.reduce((p, col) => Math.max(p, (col!.style && col.style!.height) || 0), 0)
    );

    return { rowWidthMaxByCol, colHeightMaxByRow };
}

function getRowColPositions(layout: ILayout, children: ILayoutBase[]) {
    const { rowWidthMaxByCol, colHeightMaxByRow } = getMaxRowColCells(layout, children);
    const rowTemplate = typeof layout.rows === "string" ? layout.rows.split(" ") : layout.rows;
    const rows = calcCellPositions(
        layout.rowGap,
        rowTemplate,
        layout.height,
        rowTemplate.map((row, i) => colHeightMaxByRow[i + 1])
    );
    const colTemplate = typeof layout.columns === "string" ? layout.columns.split(" ") : layout.columns;
    const columns = calcCellPositions(
        layout.columnGap,
        colTemplate,
        layout.width,
        colTemplate.map((col, i) => rowWidthMaxByCol[i + 1])
    );
    return { rows, columns };
}

export function getSizePositions(layout: ILayout, children: Dictionary<ILayoutBase>): Dictionary<ISizePosition> {
    const { rows, columns } = getRowColPositions(layout, values(children));
    return reduce(
        children,
        (p, c, k) => {
            const rowStart = c.rowStart - 1;
            const rowEnd = (c.rowEnd || c.rowStart + 1) - 1;
            const colStart = c.columnStart - 1;
            const colEnd = (c.columnEnd || c.columnStart + 1) - 1;
            return {
                ...p,
                [k]: {
                    opacity: 1,
                    top: rows[rowStart],
                    height: rows[rowEnd] - layout.rowGap - rows[rowStart],
                    left: columns[colStart],
                    width: columns[colEnd] - layout.columnGap - columns[colStart]
                }
            };
        },
        {}
    );
}
