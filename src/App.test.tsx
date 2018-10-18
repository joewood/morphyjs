// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import App from "./App";
import { getSizePositions, ILayout, ILayoutBase } from "./components/common";
import { Dictionary } from "lodash";

// it("renders without crashing", () => {
//     const div = document.createElement("div");
//     ReactDOM.render(<App />, div);
//     ReactDOM.unmountComponentAtNode(div);
// });

test("Absolute checks", () => {
    const layout: ILayout = {
        width: 100,
        height: 100,
        columns: [30, 30],
        rows: [20, 25],
        columnGap: 15,
        rowGap: 10
    };
    const children: Dictionary<ILayoutBase> = {
        one: { style: {}, columnStart: 1, rowStart: 1 },
        two: { style: {}, columnStart: 2, rowStart: 2 }
     };
    const sizes = getSizePositions(layout, children);
    expect(sizes["one"]).toMatchObject({ width: 30, height: 20, left: 0, top: 0 });
    expect(sizes["two"]).toMatchObject({ width: 30, height: 25, left: 45, top: 30 });
});

test("Percent Checks", () => {
    const layout: ILayout = {
        width: 130,
        height: 100,
        columns: "30% 50% 20%",
        rows: [20, 25],
        columnGap: 15,
        rowGap: 10
    };
    const children: Dictionary<ILayoutBase> = {
        one: { style: {}, columnStart: 1, rowStart: 1 },
        two: { style: {}, columnStart: 2, rowStart: 1 },
        three: { style: {}, columnStart: 3, rowStart: 1 }
    };
    const sizes = getSizePositions(layout, children);
    expect(sizes["one"]).toMatchObject({ width: 30, left: 0 });
    expect(sizes["two"]).toMatchObject({ width: 50, left: 45 });
    expect(sizes["three"]).toMatchObject({ width: 20, left: 110 });
});

test("Free Checks", () => {
    const layout: ILayout = {
        width: 130,
        height: 100,
        columns: "20% 50fr 50fr",
        rows: [20, 25],
        columnGap: 15,
        rowGap: 10
    };
    const children: Dictionary<ILayoutBase> = {
        one: { style: {}, columnStart: 1, rowStart: 1 },
        two: { style: {}, columnStart: 2, rowStart: 1 },
        three: { style: {}, columnStart: 3, rowStart: 1 }
    };
    const sizes = getSizePositions(layout, children);
    expect(sizes["one"]).toMatchObject({ width: 20, left: 0 });
    expect(sizes["two"]).toMatchObject({ width: 40, left: 20 + 15 });
    expect(sizes["three"]).toMatchObject({ width: 40, left: 20 + 15 + 40 + 15 });
});

test("Missing Column Checks", () => {
    const layout: ILayout = {
        width: 130,
        height: 100,
        columns: "20% 50fr 50fr",
        rows: [20, 25],
        columnGap: 15,
        rowGap: 10
    };
    const children: Dictionary<ILayoutBase> = {
        one: { style: {}, columnStart: 1, rowStart: 1 },
        three: { style: {}, columnStart: 3, rowStart: 1 }
    };
    const sizes = getSizePositions(layout, children);
    expect(sizes["one"]).toMatchObject({ width: 20, left: 0 });
    expect(sizes["three"]).toMatchObject({ width: 80, left: 20 + 15 });
});
