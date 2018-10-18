import * as React from "react";
import "./App.css";
import { Diagram } from "./components/diagram";

import { TextBoxPrimitive, TextStyle } from "./components/primitives/svg-text";
import { range } from "lodash";
import { UnitType } from "./components/common";

// let blockIndex = 0;

function block(text: string, row: number, column: number, enterFrame: number, style?: TextStyle) {
    return {
        style: {
            fill: "black",
            stroke: "#e0e0e0",
            textColor: "white",
            filter: "#blur",
            strokeWidth: 4,
            ...style
        },
        dy: 5,
        enterFrame: enterFrame,
        exitFrame: enterFrame+200,
        text: text,
        key: `Block ${text}`,
        columnStart: column,
        rowStart: row
    };
}
let nChild = 0;
const children = [
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 1, 0)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 2, 20)}  enterDirection="top" exitDirection="bottom"/>,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 3, 40)}  enterDirection="top" exitDirection="bottom"/>,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 4, 60)}  enterDirection="top" exitDirection="bottom"/>,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 5, 80)}  enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 6, 100)}  enterDirection="top" exitDirection="bottom"/>,
    // <TextBoxPrimitive {...block("Box!", 1, 6, 110, { width: 100, height: 100, stroke: "yellow" })} />,
    <TextBoxPrimitive
        columnEnd={6}
        {...block("Middle Bottom", 4, 1, 30, { stroke: "blue", fill: "#101030", width: 300, height: 100 })}
    />,
    ...range(1, 6).map(n => (
        <TextBoxPrimitive
            {...block("Side " + n, n + 1, 6, 60 + n * 15, {
                fill: `rgb(${n * 20 + 50},${170 - n * 20},100)`
            })}
            enterDirection="top"
            exitDirection="bottom"
        />
    ))
];

class App extends React.Component<unknown, { slider: number }> {
    private timer: number;

    constructor(p: unknown) {
        super(p);
        this.state = { slider: 0 };
    }
    timerEvent = () => {
        this.setState({ slider: this.state.slider + 1 });
        this.timer = requestAnimationFrame(this.timerEvent);
    };

    onStartStop = (v: React.ChangeEvent) => {
        if (!!this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = 0;
        } else {
            this.timer = requestAnimationFrame(this.timerEvent);
        }
    };

    onValueChange = (v: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ slider: v.target.valueAsNumber });
    };

    public render() {
        const { slider } = this.state;
        return (
            <div className="App" style={{ backgroundColor: "black" }}>
                <Diagram
                    key="diagram"
                    style={{
                        margin: 20
                    }}
                    width={600}
                    height={400}
                    rowGap={5} 
                    columnGap={5}
                    frame={slider % 500}
                    columns="20fr 20fr 20fr 20fr 20fr 20fr"
                    rows={
                        "2fr 2fr 2fr" +
                        range(1, 6)
                            .map<UnitType>(n => "2fr")
                            .join(" ")
                    }>
                    {children}
                </Diagram>
                <input
                    type="range"
                    min={0}
                    max={400}
                    style={{ width: "100%" }}
                    value={slider}
                    onChange={this.onValueChange}
                />
                <label key="l" title="Run:  ">
                    Run:
                    <input type="checkbox" defaultChecked={true} min={0} max={200} onChange={this.onStartStop} />
                </label>
            </div>
        );
    }
}

export default App;
