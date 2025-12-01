import { describe, expect, test } from "bun:test"
import { parseSync } from "svgson"
import { generateSvgFromDsn } from "../../lib/svg/generateSvgFromDsn"
import { DsnBoundary } from "../../lib/sexpr/classes/DsnBoundary"
import { DsnPath } from "../../lib/sexpr/classes/DsnPath"
import { DsnRect } from "../../lib/sexpr/classes/DsnRect"
import { DsnStructure } from "../../lib/sexpr/classes/DsnStructure"
import { SpectraDsn } from "../../lib/sexpr/classes/SpectraDsn"

describe("generateSvgFromDsn", () => {
  test("renders a rectangular boundary with a white background", async () => {
    const dsn = new SpectraDsn({
      designName: "RectangularBoard",
      structure: new DsnStructure({
        boundary: new DsnBoundary({
          rects: [
            new DsnRect({ layer: "signal", x1: 0, y1: 0, x2: 40, y2: 20 }),
          ],
        }),
      }),
    })

    const svg = generateSvgFromDsn(dsn)
    const parsed = parseSync(svg)

    expect(parsed.children.at(0)?.attributes.fill).toBe("#ffffff")
    await expect(svg).toMatchSvgSnapshot(import.meta.path, "rect-boundary")
  })

  test("renders polylines from boundary paths", async () => {
    const dsn = new SpectraDsn({
      designName: "PathBoard",
      structure: new DsnStructure({
        boundary: new DsnBoundary({
          paths: [
            new DsnPath({
              layer: "outline",
              width: 2,
              coordinates: [0, 0, 30, 0, 30, 15, 0, 15, 0, 0],
            }),
          ],
        }),
      }),
    })

    const svg = generateSvgFromDsn(dsn)
    const parsed = parseSync(svg)
    const polyline = parsed.children.find((child) => child.name === "polyline")

    expect(polyline?.attributes["stroke-width"]).toBe("2")
    await expect(svg).toMatchSvgSnapshot(import.meta.path, "path-boundary")
  })

  test("provides a minimal canvas even when no boundary exists", async () => {
    const dsn = new SpectraDsn({ designName: "EmptyBoard" })
    const svg = generateSvgFromDsn(dsn)
    const parsed = parseSync(svg)

    const [, , width, height] = parsed.attributes.viewBox
      ?.split(" ")
      .map(Number) ?? [0, 0, 0, 0]

    expect(width).toBeGreaterThan(0)
    expect(height).toBeGreaterThan(0)
    await expect(svg).toMatchSvgSnapshot(import.meta.path, "empty-boundary")
  })
})
