import { DsnBoundary, SpectraDsn } from "../sexpr"
import type { SvgExtractionContext, SvgRenderable, SvgViewBox } from "./types"

type Point = { x: number; y: number }

export const getDsnContext = (dsn: SpectraDsn): SvgExtractionContext => ({
  dsn,
  structure: dsn.structure,
  boundary: dsn.structure?.boundary,
})

export const collectShapesFromContext = (
  context: SvgExtractionContext,
): SvgRenderable[] => {
  const shapes: SvgRenderable[] = []
  if (context.boundary) {
    shapes.push(...collectBoundaryShapes(context.boundary))
  }
  return shapes
}

const collectBoundaryShapes = (boundary: DsnBoundary): SvgRenderable[] => {
  const shapes: SvgRenderable[] = []
  for (const path of boundary.paths) {
    const points = coordinatesToPoints(path.coordinates)
    if (points.length < 2) continue
    shapes.push({
      kind: "path",
      layer: path.layer,
      points,
      strokeWidth: path.width ?? 1,
    })
  }

  for (const rect of boundary.rects) {
    if (
      rect.x1 === undefined ||
      rect.y1 === undefined ||
      rect.x2 === undefined ||
      rect.y2 === undefined
    ) {
      continue
    }
    const minX = Math.min(rect.x1, rect.x2)
    const minY = Math.min(rect.y1, rect.y2)
    const width = Math.abs(rect.x2 - rect.x1)
    const height = Math.abs(rect.y2 - rect.y1)

    shapes.push({
      kind: "rect",
      x: minX,
      y: minY,
      width,
      height,
      layer: rect.layer,
      strokeWidth: 1,
    })
  }

  for (const polygon of boundary.polygons) {
    const points = coordinatesToPoints(polygon.coordinates)
    if (points.length < 3) continue
    shapes.push({
      kind: "path",
      points,
      layer: polygon.layer,
      strokeWidth: polygon.apertureWidth ?? 1,
      closed: true,
    })
  }

  for (const circle of boundary.circles) {
    if (circle.diameter === undefined) continue
    shapes.push({
      kind: "circle",
      cx: circle.x ?? 0,
      cy: circle.y ?? 0,
      r: circle.diameter / 2,
      strokeWidth: 1,
      layer: circle.layer,
    })
  }

  return shapes
}

const coordinatesToPoints = (coordinates: number[]): Point[] => {
  const points: Point[] = []
  for (let i = 0; i + 1 < coordinates.length; i += 2) {
    points.push({
      x: coordinates[i] as number,
      y: coordinates[i + 1] as number,
    })
  }
  return points
}

export const emptyViewBox = (): SvgViewBox => ({
  minX: 0,
  minY: 0,
  width: 100,
  height: 100,
})
