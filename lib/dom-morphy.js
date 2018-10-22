var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as React from "react";
import { repositionChildren, calcAnimationState } from "./morph-common";
import Measure from "react-measure";
export { DivPrimitive } from "./primitives/div-text";
var DomDiagram = /** @class */ (function (_super) {
    __extends(DomDiagram, _super);
    function DomDiagram(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {
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
        return _this;
    }
    DomDiagram.getDerivedStateFromProps = function (_a, _b) {
        var frame = _a.frame, children = _a.children, rowGap = _a.rowGap, rows = _a.rows, columnGap = _a.columnGap, columns = _a.columns, defaultAnimFrames = _a.defaultAnimFrames;
        var currentFrame = _b.currentFrame, velocities = _b.velocities, current = _b.current, target = _b.target, currentKeys = _b.currentKeys, lastFrame = _b.lastFrame, dimensions = _b.dimensions;
        var _c = dimensions, width = _c.width, height = _c.height;
        return calcAnimationState({ frame: frame, children: children, rowGap: rowGap, rows: rows, columnGap: columnGap, columns: columns, width: width, height: height, defaultAnimFrames: defaultAnimFrames }, { currentFrame: currentFrame, velocities: velocities, current: current, target: target, currentKeys: currentKeys, lastFrame: lastFrame });
    };
    DomDiagram.prototype.render = function () {
        var _this = this;
        var _a = this.props, style = _a.style, children = _a.children;
        var items = repositionChildren(children, this.state);
        return (React.createElement(Measure, { bounds: true, onResize: function (contentRect) {
                console.log({ contentRect: contentRect });
                _this.setState({ dimensions: contentRect.bounds });
            } }, function (_a) {
            var measureRef = _a.measureRef;
            return (React.createElement("div", { ref: measureRef, style: __assign({}, style, { position: "relative", backgroundColor: "transparent", width: "100%", height: "100%", padding: 0, overflow: "hidden" }) }, items));
        }));
    };
    return DomDiagram;
}(React.Component));
export { DomDiagram };
//# sourceMappingURL=dom-morphy.js.map