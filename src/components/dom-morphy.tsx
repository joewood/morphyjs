import * as React from "react";
import { repositionChildren, IDiagramState, IDiagramProps, calcAnimationState } from "./morph-common";

interface IProps extends IDiagramProps {}

interface IState extends IDiagramState {}

export class DomDiagram extends React.Component<IProps, IState> {
    constructor(p: IProps) {
        super(p);
        this.state = {
            currentKeys: [],
            lastFrame: -1,
            currentFrame: -1,
            velocities: {},
            target: {},
            current: {}
        };
    }

    static getDerivedStateFromProps(
        { frame, children, rowGap, rows, columnGap, columns, width, height, defaultAnimFrames }: IProps,
        { currentFrame, velocities, current, target, currentKeys, lastFrame }: IState
    ): IState | null {
        return calcAnimationState(
            { frame, children, rowGap, rows, columnGap, columns, width, height, defaultAnimFrames },
            { currentFrame, velocities, current, target, currentKeys, lastFrame }
        );
    }

    render() {
        const { style, width, height, children } = this.props;
        const items = repositionChildren(children!, this.state);
        return (
            <div
                style={{
                    ...style,
                    position: "relative",
                    backgroundColor: "transparent",
                    width: width,
                    height: height,
                    padding:0,
                    margin:20,
                    overflow:"hidden",
                }}>
                {items}
            </div>
        );
    }
}
