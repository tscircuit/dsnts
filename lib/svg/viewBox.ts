import type { SvgRenderable, SvgViewBox } from "./types"
import { emptyViewBox } from "./collectShapes"

const formatBounds = (value: number): number =>
  Number.isFinite(value) ? value : 0

export const calculateViewBox = (
  shapes: SvgRenderable[],
  padding: number,
): SvgViewBox => {
  if (shapes.length === 0) {
    return emptyViewBox()
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const shape of shapes) {
    const strokeBuffer = (shape.strokeWidth ?? 1) / 2
    if (shape.kind === "rect") {
      minX = Math.min(minX, shape.x - strokeBuffer)
      minY = Math.min(minY, shape.y - strokeBuffer)
      maxX = Math.max(maxX, shape.x + shape.width + strokeBuffer)
      maxY = Math.max(maxY, shape.y + shape.height + strokeBuffer)
      continue
    }

    if (shape.kind === "circle") {
      minX = Math.min(minX, shape.cx - shape.r - strokeBuffer)
      minY = Math.min(minY, shape.cy - shape.r - strokeBuffer)
      maxX = Math.max(maxX, shape.cx + shape.r + strokeBuffer)
      maxY = Math.max(maxY, shape.cy + shape.r + strokeBuffer)
      continue
    }

    if (shape.kind === "path") {
      for (const point of shape.points) {
        minX = Math.min(minX, point.x - strokeBuffer)
        minY = Math.min(minY, point.y - strokeBuffer)
        maxX = Math.max(maxX, point.x + strokeBuffer)
        maxY = Math.max(maxY, point.y + strokeBuffer)
      }
    }
  }

  const width = Math.max(1, maxX - minX + padding * 2)
  const height = Math.max(1, maxY - minY + padding * 2)

  return {
    minX: formatBounds(minX - padding),
    minY: formatBounds(minY - padding),
    width: formatBounds(width),
    height: formatBounds(height),
  }
}
