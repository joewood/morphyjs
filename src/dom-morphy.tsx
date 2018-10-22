import * as React from "react";
import { repositionChildren, IDiagramState, IDiagramProps, calcAnimationState } from "./morph-common";
import Measure from "react-measure";
export { DivPrimitive, IDivTextStyle } from "./primitives/div-text"

interface IProps extends IDiagramProps {}

interface IState extends IDiagramState {
    dimensions?: { width: number; height: number };
}

export class DomDiagram extends React.Component<IProps, IState> {
    constructor(p: IProps) {
        super(p);
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
        { currentFrame, velocities, current, target, currentKeys, lastFrame, dimensions }: IState
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
                    <div
                        ref={measureRef}
                        style={{
                            ...style,
                            position: "relative",
                            backgroundColor: "transparent",
                            width: "100%",
                            height: "100%",
                            padding: 0,
                            overflow: "hidden"
                        }}>
                        {items}
                    </div>
                )}
            </Measure>
        );
    }
}
