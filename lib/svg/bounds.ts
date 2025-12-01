import type { Bounds, BoundaryShape, ViewBox } from "./types"

const DEFAULT_BOUNDS: Bounds = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
}

export const calculateBounds = (shapes: BoundaryShape[]): Bounds => {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const shape of shapes) {
    if (shape.kind === "rect") {
      minX = Math.min(minX, shape.x1, shape.x2)
      minY = Math.min(minY, shape.y1, shape.y2)
      maxX = Math.max(maxX, shape.x1, shape.x2)
      maxY = Math.max(maxY, shape.y1, shape.y2)
      continue
    }

    if (shape.kind === "path") {
      for (const point of shape.points) {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
      }
    }
  }

  if (minX === Number.POSITIVE_INFINITY) return DEFAULT_BOUNDS

  return { minX, minY, maxX, maxY }
}

export const expandBoundsToViewBox = (
  bounds: Bounds,
  padding: number,
): ViewBox => {
  const rawWidth = bounds.maxX - bounds.minX
  const rawHeight = bounds.maxY - bounds.minY

  const width = rawWidth > 0 ? rawWidth : 1
  const height = rawHeight > 0 ? rawHeight : 1

  return {
    x: bounds.minX - padding,
    y: bounds.minY - padding,
    width: width + padding * 2,
    height: height + padding * 2,
  }
}
