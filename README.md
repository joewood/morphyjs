## Goal

Component that simulates CSS-Grid layout and animates using Hooke's Law of Spring Motion between layout positions. Grid positions are defined using an enter and exit time.

## Simple Example 

```typescript
<DomDiagram key="diagram"
    width={600} height={400}
    rowGap={5} columnGap={5}
    frame={time % 500}
    defaultAnimFrames={60}
    columns="20fr 20fr 20fr 20fr 20fr 20fr"
    rows="10fr 10fr 10fr 10fr 10fr 10fr 10fr">
    <TextBoxPrimitive key="Point1"
        enterFrame={40}
        rowStart={2}
        columnStart={1}
        text="Row 2 Col 1" style={{ ...title, fontSize: 12 }}/>
    <TextBoxPrimitive
        key="Point2"
        enterFrame={80}
        rowStart={3}
        columnStart={1}
        text="Row 3 Col 1"
        style={{ ...title, fontSize: 12 }} />
    <TextBoxPrimitive
        key="Point3"
        enterFrame={120}
        rowStart={4}
        columnStart={1}
        text="Row 4 Col 1"
        style={{ ...title, fontSize: 12 }}/>
</DomDiagram>

```

## Example output

![Screen Grab](video/screen-grab.gif)