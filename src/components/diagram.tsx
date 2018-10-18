import { Dictionary, keyBy } from "lodash";
import * as React from "react";
// import { spring, TransitionMotion, TransitionPlainStyle, TransitionStyle, PlainStyle, Style } from "react-motion";
import { getSizePositions, ILayout, ILayoutBase, ISizePosition } from "./common";
import Filters from "./filters";

type DirectionType = "top" | "left" | "right" | "bottom" | undefined;
export interface IBase extends ILayoutBase {
    enterFrame: number;
    exitFrame?: number;
    enterDirection?: DirectionType;
    exitDirection?: DirectionType;
}

interface IProps extends ILayout, React.ClassAttributes<Diagram> {
    frame: number;
    style: React.CSSProperties;
    children: React.ReactElement<IBase>[];
}

interface IBaseStyle extends ISizePosition {
    opacity: number;
}

interface IState {
    currentKeys: string[];
    currentFrame: number;
    lastFrame: number;
    velocities: {
        [x: string]: ISizePosition;
    };
    target: {
        [x: string]: ISizePosition;
    };
    current: {
        [x: string]: ISizePosition;
    };
}

function getItems(children: React.ReactNode, { current }: IState) {
    const childArray = React.Children.toArray(children).map(c => {
        return c as React.ReactElement<IBase>;
    });
    const newChildren = childArray.map<React.ReactElement<IBase> | null>(child => {
        const currentState = current[child.key!];
        if (!currentState) return null;
        const clone = React.cloneElement(child, {
            ...child.props,
            key: child.key!,
            style: {
                ...child.props.style,
                ...currentState
            }
        });
        return clone;
    });
    return newChildren.filter(c => !!c);
}

// originals constants
// const springK = -30;
// const springDamping = -0.97;
// const mass = 0.1;

const springK = -10;
const springDamping = -0.97;
const mass = 0.03;

function springIn(
    timeFrame: number,
    lastFrame: number,
    totalFrames: number,
    velocity: number | undefined,
    current: number,
    target: number
) {
    velocity = velocity || 0;
    current = current || 0;
    const deltaTime = timeFrame - lastFrame;
    // this the spring magic in the loop - for example the x property of an object
    // spring & damper from k (stiffness) and b (damping constant)
    var springp = springK * (current - target);
    var damper = springDamping * velocity;
    // update acceleration
    const accel = (springp + damper) / mass;
    // update velocity
    velocity += accel * (deltaTime / totalFrames);
    // update position
    current += velocity * (deltaTime / totalFrames);
    return { velocity, current };
}

const frames = 80;

function getOriginFromDir(
    direction: DirectionType,
    width: number,
    height: number
): { left: number | undefined; top: number | undefined } {
    switch (direction) {
        case "top":
            return { top: height * -1, left: undefined };
        case "bottom":
            return { top: height, left: undefined };
        case "left":
            return { left: width * -1, top: undefined };
        case "right":
            return { left: width, top: undefined };
        default:
            return { left: undefined, top: undefined };
    }
}

export class Diagram extends React.Component<IProps, IState> {
    // private svg: SVGSVGElement | null;
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
        { frame, children, rowGap, rows, columnGap, columns, width, height }: IProps,
        { currentFrame, velocities, current, target, currentKeys, lastFrame }: IState
    ): IState | null {
        // visible children include all children between enter/exit frame (+animate out time)
        const visibleChildren = React.Children.map(children!, child => child as React.ReactElement<IBase>).filter(
            c =>
                frame >= c.props.enterFrame! && (c.props.exitFrame === undefined || frame <= c.props.exitFrame + frames)
        );
        // only run layout on a subset of children, don't include the exit animation
        const layoutChildren = visibleChildren.filter(
            c => frame >= c.props.enterFrame! && (c.props.exitFrame === undefined || frame < c.props.exitFrame)
        );
        // track layout changes by comparing old and new keys
        const layoutHasChanged = layoutChildren.reduce((p, c, i) => p || c.key !== currentKeys[i], false);
        const sizeAndPositions = layoutHasChanged
            ? getSizePositions(
                  { rows, columns, rowGap, columnGap, width, height },
                  keyBy(layoutChildren.map(c => ({ ...(c.props as ILayoutBase), key: c.key! })), c => String(c.key!))
              )
            : null;

        const ret = visibleChildren.reduce(
            (state, _child, index) => {
                const child = _child as React.ReactElement<IBase>;
                const { key } = child;
                // fade in delta 0->frames after enterFrame
                let delta = Math.max(0, Math.min(frame - child.props.enterFrame, frames));

                let targetState = layoutHasChanged && sizeAndPositions ? sizeAndPositions[key!] : target[key!];

                const velocityState = velocities[key!] || {};
                // const originalState = (childrenChanged ? current[key!] : originals[key!]) || {};
                const currentState = current[key!] || {};
                let opacity = Math.min(1, delta / frames);
                if (child.props.exitFrame !== undefined && frame >= child.props.exitFrame) {
                    // optional exitDelta 0->frames after exitFrame
                    // console.log("Exit Franes", targetState, currentState);
                    // console.log("Get Dir", getOriginFromDir(child.props.exitDirection, width, height));
                    delta = frame - child.props.exitFrame;
                    opacity = Math.max(0, (frames - delta) / frames);
                    targetState = {
                        ...currentState,
                        top: getOriginFromDir(child.props.exitDirection, width, height).top || currentState.top,
                        left: getOriginFromDir(child.props.exitDirection, width, height).left || currentState.left
                    };
                }
                let left: { velocity?: number; current?: number } = {};
                left = springIn(
                    currentFrame,
                    lastFrame,
                    frames,
                    velocityState.left,
                    currentState.left ||
                        getOriginFromDir(child.props.enterDirection, width, height).left ||
                        targetState.left ||
                        0,
                    targetState.left || 0
                );
                const top = springIn(
                    currentFrame,
                    lastFrame,
                    frames,
                    velocityState.top,
                    currentState.top ||
                        getOriginFromDir(child.props.enterDirection, width, height).top ||
                        targetState.top ||
                        0,
                    targetState.top || 0
                );
                const currentWidth = springIn(
                    currentFrame,
                    lastFrame,
                    frames,
                    velocityState.width,
                    currentState.width || targetState.width || 100,
                    targetState.width || 0
                );
                const currentHeight = springIn(
                    currentFrame,
                    lastFrame,
                    frames,
                    velocityState.height,
                    currentState.height || targetState.height || 100,
                    targetState.height || 0
                );
                state.current[key!] = {
                    height: currentHeight.current,
                    width: currentWidth.current,
                    top: top.current,
                    left: left.current,
                    opacity: opacity
                };
                state.velocities[key!] = {
                    height: currentHeight.velocity,
                    width: currentWidth.velocity,
                    top: top.velocity,
                    left: left.velocity
                };
                // state.originals[key!] = childrenChanged || endAnim ? currentState : originalState;
                // state.current[key!] = currentState;
                state.target[key!] = targetState;
                return state;
            },
            {
                currentKeys: visibleChildren.map(c => String(c.key)),
                currentFrame: frame,
                lastFrame: currentFrame,
                velocities: {} as Dictionary<ISizePosition>,
                target: {} as Dictionary<ISizePosition>,
                current: {} as Dictionary<IBaseStyle>,
                originals: {} as Dictionary<ISizePosition>
            }
        );
        return ret;
    }

    render() {
        const { style, width, height, children } = this.props;
        const items = getItems(children!, this.state);
        return (
            <svg
                xmlns="http://www.w3.core/2000/svg"
                style={{
                    ...style,
                    backgroundColor: "transparent",
                    width: width,
                    height: height
                }}>
                <Filters />
                {items}
            </svg>
        );
    }
}
