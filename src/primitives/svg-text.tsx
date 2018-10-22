import * as React from "react";
import { IAnimatedChild, IBaseStyle } from "../morph-common";

export interface ITextStyle extends IBaseStyle {
    filter?: string;
    stroke?: string;
    strokeWidth?: number;
    textColor?: string;
    fill?: string;
    fontSize?: number;
}

export interface ITextBoxPrimitiveProps extends IAnimatedChild {
    // children: any[];
    text: string;
    // id: string;
    style: ITextStyle;
    dy: number;
    hideText?: boolean;
}

export class TextBoxPrimitive extends React.Component<ITextBoxPrimitiveProps, any> {
    private textBox: SVGTextElement | null;
    private oldSize: { width: number; height: number } | null = null;

    constructor(props: ITextBoxPrimitiveProps) {
        super(props);
    }

    componentDidMount() {
        if (!this.textBox || !this.props.onMeasured) return;
        const box = this.textBox.getBBox();
        if (!this.oldSize || this.oldSize.width !== box.width || this.oldSize.height !== box.height) {
            this.oldSize = { width: box.width, height: box.height };
            this.props.onMeasured(this.oldSize!);
        }
    }

    render() {
        const props = this.props;
        let { fill, filter, stroke, textColor, strokeWidth, fontSize } = props.style;
        const opacity = props.style.opacity === undefined ? 1 : props.style.opacity!;
        const { dy, text, hideText } = props;
        strokeWidth = strokeWidth || 1;
        let { width, height, left, top } = props.style;
        left = (left || 0) + strokeWidth / 2;
        top = (top || 0) + strokeWidth / 2;
        width = Math.max(0, (width || 10) - strokeWidth);
        height = Math.max(0, (height || 10) - strokeWidth);
        let textY = height! / 2;
        const textX = width! / 2;
        if (dy < 0) textY = height! + dy;
        return (
            <g transform={`translate(${left},${top})`}>
                <rect
                    width={width}
                    height={height}
                    opacity={opacity}
                    strokeOpacity={opacity}
                    fillOpacity={opacity}
                    fill={fill || "transparent"}
                    stroke={stroke || "black"}
                    strokeWidth={strokeWidth}
                    style={{
                        filter: (filter && `url(${filter})`) || undefined,
                        fillOpacity: opacity,
                        strokeOpacity: opacity,
                        opacity: opacity
                    }}
                />
                {!hideText && !!text ? (
                    <text
                        ref={v => (this.textBox = v)}
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        strokeWidth={0}
                        style={{ opacity: opacity, fillOpacity: opacity, strokeOpacity: opacity }}
                        opacity={opacity}
                        strokeOpacity={opacity}
                        fillOpacity={opacity}
                        dy={dy < 0 ? 0 : dy}
                        fill={textColor || "black"}
                        fontWeight="bold"
                        fontSize={fontSize || 20}>
                        {text}
                    </text>
                ) : null}
            </g>
        );
    }
}
