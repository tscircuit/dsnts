import { expect, test } from "bun:test"
import {
  DsnBoundary,
  DsnCircle,
  DsnPath,
  DsnPolygon,
  DsnRect,
  DsnStructure,
  parseSpectraDsn,
  SpectraDsn,
} from "lib/sexpr"

test("parses every supported boundary shape into its public collection", () => {
  const board = parseSpectraDsn(`(pcb "mixed-boundary"
    (structure (boundary
      (polygon pcb 0 0 0 10 0 10 20 0 20)
      (circle pcb 8 12 15)
      (circ pcb 4 3 5)
      (rect pcb -1 -2 30 40)
      (path pcb 0 0 0 30 0 30 40)
    )))`)
  const boundary = board.structure!.boundary!
  expect(boundary.polygons).toHaveLength(1)
  expect(boundary.circles).toHaveLength(2)
  expect(boundary.rects).toHaveLength(1)
  expect(boundary.paths).toHaveLength(1)
  expect(boundary.otherChildren).toEqual([])
  expect(boundary.getChildren()).toHaveLength(5)

  const polygon = boundary.polygons[0] as DsnPolygon
  expect(polygon).toBeInstanceOf(DsnPolygon)
  expect(polygon.coordinates).toEqual([0, 0, 10, 0, 10, 20, 0, 20])
  expect(polygon.apertureWidth).toBe(0)
  const [circle, circ] = boundary.circles as DsnCircle[]
  expect(circle).toBeInstanceOf(DsnCircle)
  expect([circle!.diameter, circle!.x, circle!.y]).toEqual([8, 12, 15])
  expect(circ).toBeInstanceOf(DsnCircle)
  expect([circ!.diameter, circ!.x, circ!.y]).toEqual([4, 3, 5])
})

test("constructed polygon and circle boundaries retain collections after round-trip", () => {
  const polygon = new DsnPolygon({
    layer: "pcb",
    apertureWidth: 0,
    coordinates: [0, 0, 10, 0, 10, 10],
  })
  const circle = new DsnCircle({ layer: "pcb", diameter: 4, x: 1, y: 2 })
  const board = new SpectraDsn({
    designName: "constructed-boundary",
    structure: new DsnStructure({
      boundary: new DsnBoundary({
        polygons: [polygon],
        circles: [circle],
        paths: [
          new DsnPath({ layer: "pcb", width: 0, coordinates: [0, 0, 5, 0] }),
        ],
        rects: [new DsnRect({ layer: "pcb", x1: 0, y1: 0, x2: 5, y2: 10 })],
      }),
    }),
  })
  const serialized = board.getString()
  const reparsed = parseSpectraDsn(serialized)
  const boundary = reparsed.structure!.boundary!
  expect(boundary.polygons).toHaveLength(1)
  expect(boundary.circles).toHaveLength(1)
  expect(boundary.polygons[0]!.getString()).toBe(polygon.getString())
  expect(boundary.circles[0]!.getString()).toBe(circle.getString())
  expect(reparsed.getString()).toBe(serialized)
})

test("edits through parsed shape collections are serialized once", () => {
  const board = parseSpectraDsn(`(pcb "editable-boundary"
    (structure (boundary
      (polygon pcb 0 0 0 10 0 10 10)
      (circle pcb 4 1 2)
    )))`)
  const boundary = board.structure!.boundary!
  expect(boundary.polygons).toHaveLength(1)
  expect(boundary.circles).toHaveLength(1)
  ;(boundary.polygons[0] as DsnPolygon).coordinates = [0, 0, 20, 0, 20, 20]
  ;(boundary.circles[0] as DsnCircle).diameter = 8

  // The collection getters return copies, while the shapes remain editable.
  boundary.polygons.pop()
  boundary.circles.pop()
  const reparsed = parseSpectraDsn(board.getString()).structure!.boundary!
  expect(reparsed.polygons).toHaveLength(1)
  expect(reparsed.circles).toHaveLength(1)
  expect(reparsed.otherChildren).toEqual([])
  expect((reparsed.polygons[0] as DsnPolygon).coordinates).toEqual([
    0, 0, 20, 0, 20, 20,
  ])
  expect((reparsed.circles[0] as DsnCircle).diameter).toBe(8)
})
