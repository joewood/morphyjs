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
import * as React from "react";
var DivPrimitive = /** @class */ (function (_super) {
    __extends(DivPrimitive, _super);
    // private textBox: SVGTextElement | null;
    // private oldSize: { width: number; height: number } | null = null;
    function DivPrimitive(props) {
        return _super.call(this, props) || this;
    }
    // componentDidMount() {
    //     if (!this.textBox || !this.props.onMeasured) return;
    //     const box = this.textBox.getBBox();
    //     if (!this.oldSize || this.oldSize.width !== box.width || this.oldSize.height !== box.height) {
    //         this.oldSize = { width: box.width, height: box.height };
    //         this.props.onMeasured(this.oldSize!);
    //     }
    // }
    DivPrimitive.prototype.render = function () {
        var props = this.props;
        var _a = props.style, fill = _a.fill, stroke = _a.stroke, textColor = _a.textColor, strokeWidth = _a.strokeWidth, fontSize = _a.fontSize;
        var opacity = props.style.opacity === undefined ? 1 : props.style.opacity;
        var dy = props.dy, text = props.text, hideText = props.hideText;
        strokeWidth = strokeWidth || 1;
        var _b = props.style, width = _b.width, height = _b.height, left = _b.left, top = _b.top;
        left = (left || 0); //+ strokeWidth / 2;
        top = (top || 0);
        ; //+ strokeWidth / 2;
        width = Math.max(0, (width || 10) - 2 * strokeWidth);
        height = Math.max(0, (height || 10) - 2 * strokeWidth);
        var textY = height / 2;
        // const textX = width! / 2;
        if (dy < 0)
            textY = height + dy;
        return (React.createElement("div", { style: {
                left: left,
                top: top,
                width: width,
                height: height,
                opacity: opacity,
                position: "absolute",
                borderWidth: strokeWidth,
                borderStyle: "solid",
                backgroundColor: fill,
                borderColor: stroke,
                color: textColor || "black",
                fontSize: fontSize,
                textAlign: "center",
                padding: 0,
                margin: 0,
                overflow: "hidden",
                filter: "blue(10)"
            } }, !hideText && !!text ? React.createElement("div", { style: { paddingTop: textY } }, text) : null));
    };
    return DivPrimitive;
}(React.Component));
export { DivPrimitive };
//# sourceMappingURL=div-text.js.map