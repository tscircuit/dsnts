import type { BoundaryShape } from "./types"
import { DsnBoundary } from "../sexpr/classes/DsnBoundary"
import { DsnPath } from "../sexpr/classes/DsnPath"
import { DsnRect } from "../sexpr/classes/DsnRect"

function rectToShape(rect: DsnRect): BoundaryShape | undefined {
  const x1 = rect.x1
  const y1 = rect.y1
  const x2 = rect.x2
  const y2 = rect.y2

  if (
    x1 === undefined ||
    y1 === undefined ||
    x2 === undefined ||
    y2 === undefined
  ) {
    return undefined
  }

  return {
    kind: "rect",
    layer: rect.layer,
    x1,
    y1,
    x2,
    y2,
  }
}

function pathToShape(path: DsnPath): BoundaryShape | undefined {
  const coordinates = path.coordinates
  if (coordinates.length < 4 || coordinates.length % 2 !== 0) return undefined

  const points: { x: number; y: number }[] = []
  for (let i = 0; i < coordinates.length; i += 2) {
    const x = coordinates[i]
    const y = coordinates[i + 1]
    if (x === undefined || y === undefined) continue
    points.push({ x, y })
  }

  return {
    kind: "path",
    layer: path.layer,
    width: path.width,
    points,
  }
}

export const extractBoundaryShapes = (
  boundary: DsnBoundary,
): BoundaryShape[] => {
  const shapes: BoundaryShape[] = []

  for (const rect of boundary.rects) {
    const shape = rectToShape(rect)
    if (shape) shapes.push(shape)
  }

  for (const path of boundary.paths) {
    const shape = pathToShape(path)
    if (shape) shapes.push(shape)
  }

  return shapes
}
