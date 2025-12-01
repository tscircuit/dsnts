import type {
  BoundaryShape,
  GenerateSvgOptions,
  SvgChildNode,
  ViewBox,
} from "./types"

const DEFAULT_STROKE = "#111827"
const DEFAULT_STROKE_WIDTH = 1

const createPolyline = (
  shape: Extract<BoundaryShape, { kind: "path" }>,
  options: GenerateSvgOptions,
): SvgChildNode => {
  const strokeColor = options.strokeColor ?? DEFAULT_STROKE
  const strokeWidth = shape.width ?? options.strokeWidth ?? DEFAULT_STROKE_WIDTH
  const points = shape.points.map((point) => `${point.x},${point.y}`).join(" ")

  return {
    name: "polyline",
    type: "element",
    value: "",
    attributes: {
      fill: "none",
      stroke: strokeColor,
      "stroke-width": String(strokeWidth),
      points,
      ...(shape.layer ? { "data-layer": shape.layer } : {}),
    },
    children: [],
  }
}

const createRect = (
  shape: Extract<BoundaryShape, { kind: "rect" }>,
  options: GenerateSvgOptions,
): SvgChildNode => {
  const strokeColor = options.strokeColor ?? DEFAULT_STROKE
  const strokeWidth = options.strokeWidth ?? DEFAULT_STROKE_WIDTH
  const x = Math.min(shape.x1, shape.x2)
  const y = Math.min(shape.y1, shape.y2)
  const width = Math.abs(shape.x2 - shape.x1)
  const height = Math.abs(shape.y2 - shape.y1)

  return {
    name: "rect",
    type: "element",
    value: "",
    attributes: {
      x: String(x),
      y: String(y),
      width: String(width),
      height: String(height),
      fill: "none",
      stroke: strokeColor,
      "stroke-width": String(strokeWidth),
      ...(shape.layer ? { "data-layer": shape.layer } : {}),
    },
    children: [],
  }
}

export const createBackgroundNode = (
  viewBox: ViewBox,
  backgroundColor: string,
): SvgChildNode => ({
  name: "rect",
  type: "element",
  value: "",
  attributes: {
    x: String(viewBox.x),
    y: String(viewBox.y),
    width: String(viewBox.width),
    height: String(viewBox.height),
    fill: backgroundColor,
  },
  children: [],
})

export const shapesToSvgNodes = (
  shapes: BoundaryShape[],
  options: GenerateSvgOptions,
): SvgChildNode[] =>
  shapes.map((shape) => {
    if (shape.kind === "rect") return createRect(shape, options)
    return createPolyline(shape, options)
  })
