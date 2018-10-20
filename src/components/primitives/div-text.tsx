import * as React from "react";
import { IAnimatedChild, IBaseStyle } from "../morph-common";

export interface IDivTextStyle extends IBaseStyle {
    filter?: string;
    stroke?: string;
    strokeWidth?: number;
    textColor?: string;
    fill?: string;
    fontSize?: number;
}

export interface IDivPrimitiveProps extends IAnimatedChild {
    // children: any[];
    text: string;
    // id: string;
    style: IDivTextStyle;
    dy: number;
    hideText?: boolean;
}

export class DivPrimitive extends React.Component<IDivPrimitiveProps, any> {
    // private textBox: SVGTextElement | null;
    // private oldSize: { width: number; height: number } | null = null;

    constructor(props: IDivPrimitiveProps) {
        super(props);
    }

    // componentDidMount() {
    //     if (!this.textBox || !this.props.onMeasured) return;
    //     const box = this.textBox.getBBox();
    //     if (!this.oldSize || this.oldSize.width !== box.width || this.oldSize.height !== box.height) {
    //         this.oldSize = { width: box.width, height: box.height };
    //         this.props.onMeasured(this.oldSize!);
    //     }
    // }

    render() {
        const props = this.props;
        let { fill, stroke, textColor, strokeWidth, fontSize } = props.style;
        const opacity = props.style.opacity === undefined ? 1 : props.style.opacity!;
        const { dy, text, hideText } = props;
        strokeWidth = strokeWidth || 1;
        let { width, height, left, top } = props.style;
        left = (left || 0) ;//+ strokeWidth / 2;
        top = (top || 0) ;;//+ strokeWidth / 2;
        width = Math.max(0, (width || 10) - 2*strokeWidth);
        height = Math.max(0, (height || 10) - 2*strokeWidth);
        let textY = height! / 2;
        // const textX = width! / 2;
        if (dy < 0) textY = height! + dy;
        return (
            <div
                style={{
                    left,
                    top,
                    width,
                    height,
                    opacity,
                    position: "absolute",
                    borderWidth: strokeWidth,
                    borderStyle: "solid",
                    backgroundColor: fill,
                    borderColor: stroke,
                    color: textColor || "black",
                    fontSize,
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                    filter:"blue(10)"
                }}>
                {!hideText && !!text ? <div style={{ paddingTop: textY }}>{text}</div> : null}
            </div>
        );
    }
}
