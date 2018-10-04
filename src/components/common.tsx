import { groupBy, mapValues } from "lodash";
// import * as React from "react";

export function pt(n: number) {
    return n * 2;
}

export function em(n: number) {
    return n * 12;
}

type UnitType = number | [number, "fr"] | [number, "%"] | "auto";

export interface ILayout {
    width: number;
    height: number;
    rows: UnitType[];
    rowGap: number;
    columns: UnitType[];
    columnGap: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBase {
    style?: IStyle;
    columnStart: number;
    columnEnd?: number;
    rowStart: number;
    rowEnd?: number;
    enterFrame?: number;
    exitFrame?: number;
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
        if (typeof cell === "number") {
            p += cell;
        } else if (cell === "auto") {
            p += maxColRowSize[i] || 0;
        } else if (typeof cell === "object" && Array.isArray(cell)) {
            if (cell[1] === "fr") {
                totalFr += cell[0];
            } else if (cell[1] === "%") {
                p += (cell[0] * remain) / 100;
            }
        }
        return p;
    }, 0);
    const free = remain - accumulatedWidth;
    let position = 0;
    const positions = cells.map((cell, i) => {
        if (typeof cell === "number") {
            position += cell + gap;
            return position;
        } else if (cell === "auto") {
            position += (maxColRowSize[i] || 0) + gap;
        } else if (typeof cell === "object" && Array.isArray(cell)) {
            if (cell[1] === "fr") {
                position += (cell[0] / totalFr) * free + gap;
            } else if (cell[1] === "%") {
                position += (cell[0] * remain) / 100 + gap;
            }
        }
        return position;
    });
    return [0, ...positions];
}

function getMaxRowColCells(layout: ILayout, children: IBase[]) {
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

function getRowColPositions(layout: ILayout, children: IBase[]) {
    const { rowWidthMaxByCol, colHeightMaxByRow } = getMaxRowColCells(layout, children);
    const rows = calcCellPositions(
        layout.rowGap,
        layout.rows,
        layout.height,
        layout.rows.map((row, i) => colHeightMaxByRow[i + 1] || 0)
    );
    const columns = calcCellPositions(
        layout.columnGap,
        layout.columns,
        layout.width,
        layout.columns.map((col, i) => rowWidthMaxByCol[i + 1] || 0)
    );
    return { rows, columns };
}

export function getSizePositions(layout: ILayout, children: IBase[]): ISizePosition[] {
    const { rows, columns } = getRowColPositions(layout, children);
    return children.map(c => {
        const rowStart = c.rowStart - 1;
        const rowEnd = (c.rowEnd || c.rowStart + 1) - 1;
        const colStart = c.columnStart - 1;
        const colEnd = (c.columnEnd || c.columnStart + 1) - 1;
        // console.log(
        //     { c },
        //     `${rows[rowStart]} to ${rows[rowEnd] - layout.rowGap - rows[rowStart]}`
        // );
        return {
            top: rows[rowStart],
            height: rows[rowEnd] - layout.rowGap - rows[rowStart],
            left: columns[colStart],
            width: columns[colEnd] - layout.columnGap - columns[colStart]
        };
    });
}

// export function extractChildren(children: React.ReactNode): any[] {
//     return React.Children.map(children, c => {
//         const child = c as React.ComponentElement<any, any>;
//         if (!child.props) {
//             console.warn("Null props", child);
//             return null;
//         }
//         return {
//             ...child.props,
//             key: child.key || child.props.id,
//             id: child.props.id || child.key,
//             children: !!child.props.children ? extractChildren(child.props.children) : null
//         };
//     }).filter(c => !!c);
// }

// export function keyStyles({ children, ...props }: any): any {
//     return {
//         ...props,
//         children:
//             (!!children && keyBy((children as any[]).filter(c => !!c.key).map(c => keyStyles(c)), p => p.key)) || null
//     };
// }
