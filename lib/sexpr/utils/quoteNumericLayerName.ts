import { quoteSExprString } from "./quoteSExprString"

export const quoteNumericLayerName = (layer: string): string =>
  /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(layer)
    ? quoteSExprString(layer)
    : layer
