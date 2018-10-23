import * as React from "react";
import { repositionChildren, IDiagramState, IDiagramProps, calcAnimationState } from "./morph-common";
import Filters from "./filters";
import Measure from "react-measure";
export { TextBoxPrimitive, ITextStyle } from "./primitives/svg-text";

interface IProps extends IDiagramProps {}

interface IState extends IDiagramState {
    dimensions?: { width: number; height: number };
}

export class Diagram extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentKeys: [],
            lastFrame: -1,
            currentFrame: -1,
            velocities: {},
            target: {},
            current: {},
            dimensions: {
                width: -1,
                height: -1
            }
        };
    }

    static getDerivedStateFromProps(
        { frame, children, rowGap, rows, columnGap, columns, defaultAnimFrames }: IProps,
        { currentFrame, velocities, current, target, dimensions, currentKeys, lastFrame }: IState
    ): IState | null {
        const { width, height } = dimensions!;
        return calcAnimationState(
            { frame, children, rowGap, rows, columnGap, columns, width, height, defaultAnimFrames },
            { currentFrame, velocities, current, target, currentKeys, lastFrame }
        );
    }

    render() {
        const { style, children } = this.props;
        const items = repositionChildren(children!, this.state);
        return (
            <Measure
                bounds
                onResize={contentRect => {
                    console.log({ contentRect });
                    this.setState({ dimensions: contentRect.bounds });
                }}>
                {({ measureRef }) => (
                    <svg
                        ref={measureRef}
                        xmlns="http://www.w3.core/2000/svg"
                        style={{
                            ...style,
                            backgroundColor: "transparent",
                            width: "100%",
                            height: "100%"
                        }}>
                        <Filters />
                        {items}
                    </svg>
                )}
            </Measure>
        );
    }
}
