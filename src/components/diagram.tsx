import * as React from "react";
import { spring, TransitionMotion, TransitionPlainStyle, TransitionStyle, PlainStyle, Style } from "react-motion";
import { getSizePositions, IBase, ILayout } from "./common";
import Filters from "./filters";

interface IProps extends ILayout, React.Props<any> {
    frame: number;
    generation?: number;
    style:React.CSSProperties;
}

const childrenFn = (childStyles: TransitionPlainStyle[]) => (
    <g>
        {childStyles.map(config => {
            return React.cloneElement(config.data.child as React.ComponentElement<IBase, any>, {
                style: {
                    ...config.data.props.style,
                    ...config.style
                },
                key: config.key
            });
        })}
    </g>
);

function getItems(props: IProps) {
    const children = React.Children.map(props.children, child => child as React.ComponentElement<IBase, any>).filter(
        c => props.frame >= c.props.enterFrame!
    );
    const sizeAndPositions = getSizePositions(props, children.map(c => c.props));
    console.log("PROPS", children.map(c => c.key));
    // console.log({sizeAndPositions})
    return children.map((child, index) => ({
        key: "XX" + String(child.key) + (props.generation === undefined ? "" : String(props.generation)),
        child: child,
        props: child.props,
        opacity: 0,
        frame: child.props.enterFrame!,
        left: sizeAndPositions[index].left!,
        top: sizeAndPositions[index].top!,
        width: sizeAndPositions[index].width!,
        height: sizeAndPositions[index].height!
    }));
}

export class Diagram extends React.Component<IProps, any> {
    private svg: SVGSVGElement | null;
    constructor(p: IProps) {
        super(p);
    }

    private willLeave(): Style {
        return { opacity: spring(0) };
    }

    private willEnter(style: TransitionStyle): PlainStyle {
        return {
            width: 10,
            height: 10,
            left: style.data.left + style.data.width / 2,
            top: style.data.top + style.data.height / 2,
            opacity: 0
        };
    }

    render() {
        const { style, width, height } = this.props;
        const items = getItems(this.props);

        return (
            <svg
                ref={svg => (this.svg = svg)}
                xmlns="http://www.w3.core/2000/svg"
                style={{
                    ...style,
                    backgroundColor: "transparent",
                    width: width,
                    height: height
                }}>
                <Filters />
                <TransitionMotion
                    willEnter={this.willEnter}
                    willLeave={this.willLeave}
                    defaultStyles={items.map(item => ({
                        key: item.key,
                        data: item,
                        style: {
                            width: 5,
                            height: 5,
                            left: item.left + item.width / 2,
                            top: item.top + item.height / 2,
                            opacity: 0
                        }
                    }))}
                    styles={items.map(item => ({
                        key: item.key,
                        data: item,
                        style: {
                            left: spring(item.left),
                            top: spring(item.top),
                            width: spring(item.width),
                            height: spring(item.height),
                            opacity: spring(1)
                        }
                    }))}>
                    {childrenFn}
                </TransitionMotion>
            </svg>
        );
    }
}
