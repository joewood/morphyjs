import * as React from "react";
import "./App.css";
import { Diagram } from "./components/diagram";

import { TextBoxPrimitive, TextStyle } from "./components/primitives/svg-text";

let blockIndex = 0;

function block(text: string, row: number, column: number, frame: number, style?: TextStyle) {
    return {
        style: {
            fill: "transparent",
            stroke: "#e0e0e0",
            width: 50,
            height: 50,
            textColor: "white",
            filter: "#blur",
            strokeWidth: 4,
            ...style
        },
        dy: 5,
        enterFrame: frame,
        text: text,
        key: `${blockIndex++}_block`,
        columnStart: column,
        rowStart: row
    };
}

const children = [
    <TextBoxPrimitive {...block("Top Left", 1, 1, 0)} />,
    <TextBoxPrimitive {...block("Top Right", 1, 3, 5)} />,
    <TextBoxPrimitive {...block("Middle Top", 1, 2, 60, { width: 100, height: 100, stroke: "yellow" })} />,
    <TextBoxPrimitive
        columnEnd={4}
        {...block("Middle Bottom", 2, 1, 30, { stroke: "blue", fill: "#101030", width: 300, height: 100 })}
    />
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
                    rowGap={30}
                    columnGap={30}
                    frame={slider % 200}
                    generation={Math.floor(slider / 200)}
                    columns={[[20, "%"], [1,"fr"], [20, "%"]]}
                    rows={[[2, "fr"], [2, "fr"]]}>
                    {children}
                </Diagram>
                <input
                    type="range"
                    min={0}
                    max={200}
                    style={{ width: "100%" }}
                    value={slider}
                    onChange={this.onValueChange}
                />
                <label key="l" title="Run:  ">
                    Run:
                    <input type="checkbox" defaultChecked={false} min={0} max={200} onChange={this.onStartStop} />
                </label>
            </div>
        );
    }
}

export default App;
