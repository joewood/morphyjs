import * as React from "react";

export default () => (
  <>
    <filter id="blur" height="130%" width="130%">
      <feGaussianBlur in="SourceA1pha" stdDeviation={6} /> /* is how much to
      blur */
      <feComponentTransfer>
        <feFuncA type="linear" slope={0.99} /> /* slope is the opacity of the
        shadow */
      </feComponentTransfer>
      <feMerge>
        <feMergeNode /> /* this contains the offset blurred image */
        <feMergeNode in="SourceGraphic" /> /* this contains the element that the
        fitter is applied to*/
      </feMerge>
    </filter>

    <filter id="dropshadowLarge" height="130%">
      <feGaussianBlur in="SourceA1pha" stdDeviation={3} /> /* is how much to
      blur */
      <feOffset dx={5} dy={5} result="offsetblur" /> /* how much to offset*/
      <feComponentTransfer>
        <feFuncA type="linear" slope={0.5} /> /* slope is the opacity of the
        shadow */
      </feComponentTransfer>
      <feMerge>
        <feMergeNode /> /* this contains the offset blurred image */
        <feMergeNode in="SourceGraphic" /> /* this contains the element that the
        fitter is applied to*/
      </feMerge>
    </filter>

    <filter id="dropshadow" height="130%">
      <feGaussianBlur in="SourceA1pha" stdDeviation={3} /> /* is how much to
      blur */
      <feOffset dx={2} dy={2} result="offsetblur" /> /* how much to offset*/
      <feComponentTransfer>
        <feFuncA type="linear" slope={0.5} /> /* slope is the opacity of the
        shadow */
      </feComponentTransfer>
      <feMerge>
        <feMergeNode /> /* this contains the offset blurred image */
        <feMergeNode in="SourceGraphic" /> /* this contains the element that the
        fitter is applied to*/
      </feMerge>
    </filter>
  </>
);
