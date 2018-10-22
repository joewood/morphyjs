var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { keyBy } from "lodash";
import * as React from "react";
import { getSizePositions } from "./layout";
export function repositionChildren(children, _a) {
    var current = _a.current;
    var childArray = React.Children.toArray(children).map(function (c) {
        return c;
    });
    var newChildren = childArray.map(function (child) {
        var currentState = current[child.key];
        if (!currentState)
            return null;
        var clone = React.cloneElement(child, __assign({}, child.props, { key: child.key, style: __assign({}, child.props.style, currentState) }));
        return clone;
    });
    return newChildren.filter(function (c) { return !!c; });
}
// originals constants
// const springK = -30;
// const springDamping = -0.97;
// const mass = 0.1;
var springK = -10;
var springDamping = -0.97;
var mass = 0.03;
export function spring(timeFrame, lastFrame, totalFrames, velocity, current, target) {
    velocity = velocity || 0;
    current = current || 0;
    var deltaTime = timeFrame - lastFrame;
    // this the spring magic in the loop - for example the x property of an object
    // spring & damper from k (stiffness) and b (damping constant)
    var springp = springK * (current - target);
    var damper = springDamping * velocity;
    // update acceleration
    var accel = (springp + damper) / mass;
    // update velocity
    velocity += accel * (deltaTime / totalFrames);
    // update position
    current += velocity * (deltaTime / totalFrames);
    return { velocity: velocity, current: current };
}
export function getOriginFromDir(direction, width, height) {
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
export function calcAnimationState(_a, _b) {
    var frame = _a.frame, children = _a.children, rowGap = _a.rowGap, rows = _a.rows, columnGap = _a.columnGap, columns = _a.columns, width = _a.width, height = _a.height, defaultAnimFrames = _a.defaultAnimFrames;
    var currentFrame = _b.currentFrame, velocities = _b.velocities, current = _b.current, target = _b.target, currentKeys = _b.currentKeys, lastFrame = _b.lastFrame;
    // visible children include all children between enter/exit frame (+animate out time)
    var visibleChildren = React.Children.map(children, function (child) { return child; }).filter(function (c) {
        return frame >= c.props.enterFrame &&
            (c.props.exitFrame === undefined || frame <= c.props.exitFrame + defaultAnimFrames);
    });
    // only run layout on a subset of children, don't include the exit animation
    var layoutChildren = visibleChildren.filter(function (c) { return frame >= c.props.enterFrame && (c.props.exitFrame === undefined || frame < c.props.exitFrame); });
    // track layout changes by comparing old and new keys
    var layoutHasChanged = layoutChildren.reduce(function (p, c, i) { return p || c.key !== currentKeys[i]; }, false);
    var sizeAndPositions = layoutHasChanged
        ? getSizePositions({ rows: rows, columns: columns, rowGap: rowGap, columnGap: columnGap, width: width, height: height }, keyBy(layoutChildren.map(function (c) { return (__assign({}, c.props, { key: c.key })); }), function (c) {
            return String(c.key);
        }))
        : null;
    var ret = visibleChildren.reduce(function (state, _child, index) {
        var child = _child;
        var key = child.key;
        // fade in delta 0->frames after enterFrame
        var delta = Math.max(0, Math.min(frame - child.props.enterFrame, defaultAnimFrames));
        var targetState = layoutHasChanged && sizeAndPositions ? sizeAndPositions[key] : target[key];
        var velocityState = velocities[key] || {};
        // const originalState = (childrenChanged ? current[key!] : originals[key!]) || {};
        var currentState = current[key] || {};
        var opacity = Math.min(1, delta / defaultAnimFrames);
        if (child.props.exitFrame !== undefined && frame >= child.props.exitFrame) {
            // optional exitDelta 0->frames after exitFrame
            // console.log("Exit Franes", targetState, currentState);
            // console.log("Get Dir", getOriginFromDir(child.props.exitDirection, width, height));
            delta = frame - child.props.exitFrame;
            opacity = Math.max(0, (defaultAnimFrames - delta) / defaultAnimFrames);
            targetState = __assign({}, currentState, { top: getOriginFromDir(child.props.exitDirection, width, height).top || currentState.top, left: getOriginFromDir(child.props.exitDirection, width, height).left || currentState.left });
        }
        var left = {};
        left = spring(currentFrame, lastFrame, defaultAnimFrames, velocityState.left, currentState.left ||
            getOriginFromDir(child.props.enterDirection, width, height).left ||
            targetState.left ||
            0, targetState.left || 0);
        var top = spring(currentFrame, lastFrame, defaultAnimFrames, velocityState.top, currentState.top ||
            getOriginFromDir(child.props.enterDirection, width, height).top ||
            targetState.top ||
            0, targetState.top || 0);
        var currentWidth = spring(currentFrame, lastFrame, defaultAnimFrames, velocityState.width, currentState.width || targetState.width || 100, targetState.width || 0);
        var currentHeight = spring(currentFrame, lastFrame, defaultAnimFrames, velocityState.height, currentState.height || targetState.height || 100, targetState.height || 0);
        state.current[key] = {
            height: currentHeight.current,
            width: currentWidth.current,
            top: top.current,
            left: left.current,
            opacity: opacity
        };
        state.velocities[key] = {
            height: currentHeight.velocity,
            width: currentWidth.velocity,
            top: top.velocity,
            left: left.velocity
        };
        state.target[key] = targetState;
        return state;
    }, {
        currentKeys: visibleChildren.map(function (c) { return String(c.key); }),
        currentFrame: frame,
        lastFrame: currentFrame,
        velocities: {},
        target: {},
        current: {},
        originals: {}
    });
    return ret;
}
//# sourceMappingURL=morph-common.js.map