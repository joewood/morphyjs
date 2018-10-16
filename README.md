# Notes

```typescript
export interface IBase {
    style?: IStyle;
    columnStart: number;
    columnEnd?: number;
    rowStart: number;
    rowEnd?: number;
    enterFrame?: number;
    exitFrame?: number;
    onMeasured?: (size: ISize) => void;
}
```

## Derived State

