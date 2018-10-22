import { range } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DomDiagram, DivPrimitive, IDivTextStyle } from "../src/dom-morphy";
import { ITextStyle, TextBoxPrimitive } from "../src/primitives/svg-text";
import "./index.css";

function block(text: string, row: number, column: number, enterFrame: number, style?: ITextStyle | IDivTextStyle) {
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
        exitFrame: enterFrame + 200,
        text: text,
        key: `Block ${text}`,
        columnStart: column,
        rowStart: row
    };
}
let nChild = 0;
// @ts-ignore
const testChildren = [
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 1, 0)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 2, 20)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 3, 40)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 4, 60)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 5, 80)} enterDirection="top" exitDirection="bottom" />,
    <TextBoxPrimitive {...block("Box " + nChild++, 1, 6, 100)} enterDirection="top" exitDirection="bottom" />,
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

// @ts-ignore
const domChildren = [
    <DivPrimitive {...block("Box " + nChild++, 1, 1, 0)} enterDirection="top" exitDirection="bottom" />,
    <DivPrimitive {...block("Box " + nChild++, 1, 2, 20)} enterDirection="top" exitDirection="bottom" />,
    <DivPrimitive {...block("Box " + nChild++, 1, 3, 40)} enterDirection="top" exitDirection="bottom" />,
    <DivPrimitive {...block("Box " + nChild++, 1, 4, 60)} enterDirection="top" exitDirection="bottom" />,
    <DivPrimitive {...block("Box " + nChild++, 1, 5, 80)} enterDirection="top" exitDirection="bottom" />,
    <DivPrimitive
        columnEnd={6}
        {...block("Middle Bottom", 4, 1, 30, { stroke: "blue", fill: "#101030", width: 300, height: 100 })}
    />,
    ...range(1, 7).map(n => (
        <DivPrimitive
            {...block("Side " + n, n, 6, 60 + n * 15, {
                fill: `rgb(${n * 20 + 50},${80 + n * 20},100)`
            })}
            enterDirection="top"
            exitDirection="right"
        />
    ))
];

const title = {
    fontSize: 34,
    fill: "black",
    // stroke: "#e0e0e0",
    textColor: "white",
    filter: "#blur",
    strokeWidth: 0
};

const frames = 80;

// @ts-ignore
const presentation = [
    <TextBoxPrimitive
        key="Title"
        enterFrame={0}
        rowStart={1}
        columnStart={1}
        text="Problem with Services"
        dy={25}
        style={title}
    />,
    <TextBoxPrimitive
        key="Point1"
        enterFrame={40}
        rowStart={2}
        columnStart={1}
        text="* SSSS"
        dy={25}
        style={{ ...title, fontSize: 12 }}
    />,
    <TextBoxPrimitive
        key="Point2"
        enterFrame={80}
        rowStart={3}
        columnStart={1}
        text="* SSSS"
        dy={25}
        style={{ ...title, fontSize: 12 }}
    />,
    <TextBoxPrimitive
        key="Point3"
        enterFrame={120}
        rowStart={4}
        columnStart={1}
        text="* SSSS"
        dy={25}
        style={{ ...title, fontSize: 12 }}
    />,
    <TextBoxPrimitive
        key="Point4"
        enterFrame={160}
        rowStart={5}
        columnStart={1}
        text="* SSSS"
        dy={25}
        style={{ ...title, fontSize: 12 }}
    />,
    <TextBoxPrimitive
        key="Point5"
        enterFrame={200}
        rowStart={6}
        columnStart={1}
        text="* SSSS"
        dy={25}
        style={{ ...title, fontSize: 12 }}
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

    onStartStop = (v: React.ChangeEvent | null) => {
        if (!!this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = 0;
        } else {
            this.timer = requestAnimationFrame(this.timerEvent);
        }
    };

    componentDidMount() {
        this.onStartStop(null);
    }

    public render() {
        const { slider } = this.state;
        return (
            <div
                style={{
                    width: "calc( 100% - 20px )",
                    height: "calc( 100% - 20px )",
                    margin: 20,
                    backgroundColor: "black"
                }}>
                <DomDiagram
                    key="diagram"
                    style={{}}
                    rowGap={5}
                    columnGap={5}
                    frame={slider % 500}
                    columns="20fr 20fr 20fr 20fr 20fr 20fr"
                    defaultAnimFrames={frames}
                    rows={range(1, 10)
                        .map(n => "10fr")
                        .join(" ")}>
                    {domChildren}
                </DomDiagram>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
