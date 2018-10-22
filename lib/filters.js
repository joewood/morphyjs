import * as React from "react";
export default (function () { return (React.createElement(React.Fragment, null,
    React.createElement("filter", { id: "blur", height: "130%", width: "130%" },
        React.createElement("feGaussianBlur", { in: "SourceA1pha", stdDeviation: 6 }) /* is how much to
        blur */,
        " /* is how much to blur */",
        React.createElement("feComponentTransfer", null,
            React.createElement("feFuncA", { type: "linear", slope: 0.99 }) /* slope is the opacity of the
            shadow */,
            " /* slope is the opacity of the shadow */"),
        React.createElement("feMerge", null,
            React.createElement("feMergeNode", null) /* this contains the offset blurred image */,
            " /* this contains the offset blurred image */",
            React.createElement("feMergeNode", { in: "SourceGraphic" }) /* this contains the element that the
            fitter is applied to*/,
            " /* this contains the element that the fitter is applied to*/")),
    React.createElement("filter", { id: "dropshadowLarge", height: "130%" },
        React.createElement("feGaussianBlur", { in: "SourceA1pha", stdDeviation: 3 }) /* is how much to
        blur */,
        " /* is how much to blur */",
        React.createElement("feOffset", { dx: 5, dy: 5, result: "offsetblur" }) /* how much to offset*/,
        " /* how much to offset*/",
        React.createElement("feComponentTransfer", null,
            React.createElement("feFuncA", { type: "linear", slope: 0.5 }) /* slope is the opacity of the
            shadow */,
            " /* slope is the opacity of the shadow */"),
        React.createElement("feMerge", null,
            React.createElement("feMergeNode", null) /* this contains the offset blurred image */,
            " /* this contains the offset blurred image */",
            React.createElement("feMergeNode", { in: "SourceGraphic" }) /* this contains the element that the
            fitter is applied to*/,
            " /* this contains the element that the fitter is applied to*/")),
    React.createElement("filter", { id: "dropshadow", height: "130%" },
        React.createElement("feGaussianBlur", { in: "SourceA1pha", stdDeviation: 3 }) /* is how much to
        blur */,
        " /* is how much to blur */",
        React.createElement("feOffset", { dx: 2, dy: 2, result: "offsetblur" }) /* how much to offset*/,
        " /* how much to offset*/",
        React.createElement("feComponentTransfer", null,
            React.createElement("feFuncA", { type: "linear", slope: 0.5 }) /* slope is the opacity of the
            shadow */,
            " /* slope is the opacity of the shadow */"),
        React.createElement("feMerge", null,
            React.createElement("feMergeNode", null) /* this contains the offset blurred image */,
            " /* this contains the offset blurred image */",
            React.createElement("feMergeNode", { in: "SourceGraphic" }) /* this contains the element that the
            fitter is applied to*/,
            " /* this contains the element that the fitter is applied to*/")))); });
//# sourceMappingURL=filters.js.map