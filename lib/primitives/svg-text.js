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
var TextBoxPrimitive = /** @class */ (function (_super) {
    __extends(TextBoxPrimitive, _super);
    function TextBoxPrimitive(props) {
        var _this = _super.call(this, props) || this;
        _this.oldSize = null;
        return _this;
    }
    TextBoxPrimitive.prototype.componentDidMount = function () {
        if (!this.textBox || !this.props.onMeasured)
            return;
        var box = this.textBox.getBBox();
        if (!this.oldSize || this.oldSize.width !== box.width || this.oldSize.height !== box.height) {
            this.oldSize = { width: box.width, height: box.height };
            this.props.onMeasured(this.oldSize);
        }
    };
    TextBoxPrimitive.prototype.render = function () {
        var _this = this;
        var props = this.props;
        var _a = props.style, fill = _a.fill, filter = _a.filter, stroke = _a.stroke, textColor = _a.textColor, strokeWidth = _a.strokeWidth, fontSize = _a.fontSize;
        var opacity = props.style.opacity === undefined ? 1 : props.style.opacity;
        var dy = props.dy, text = props.text, hideText = props.hideText;
        strokeWidth = strokeWidth || 1;
        var _b = props.style, width = _b.width, height = _b.height, left = _b.left, top = _b.top;
        left = (left || 0) + strokeWidth / 2;
        top = (top || 0) + strokeWidth / 2;
        width = Math.max(0, (width || 10) - strokeWidth);
        height = Math.max(0, (height || 10) - strokeWidth);
        var textY = height / 2;
        var textX = width / 2;
        if (dy < 0)
            textY = height + dy;
        return (React.createElement("g", { transform: "translate(" + left + "," + top + ")" },
            React.createElement("rect", { width: width, height: height, opacity: opacity, strokeOpacity: opacity, fillOpacity: opacity, fill: fill || "transparent", stroke: stroke || "black", strokeWidth: strokeWidth, style: {
                    filter: (filter && "url(" + filter + ")") || undefined,
                    fillOpacity: opacity,
                    strokeOpacity: opacity,
                    opacity: opacity
                } }),
            !hideText && !!text ? (React.createElement("text", { ref: function (v) { return (_this.textBox = v); }, x: textX, y: textY, textAnchor: "middle", strokeWidth: 0, style: { opacity: opacity, fillOpacity: opacity, strokeOpacity: opacity }, opacity: opacity, strokeOpacity: opacity, fillOpacity: opacity, dy: dy < 0 ? 0 : dy, fill: textColor || "black", fontWeight: "bold", fontSize: fontSize || 20 }, text)) : null));
    };
    return TextBoxPrimitive;
}(React.Component));
export { TextBoxPrimitive };
//# sourceMappingURL=svg-text.js.map