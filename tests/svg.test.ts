import { expect, test } from "bun:test"
import { parse, stringify } from "svgson"
import {
  DsnBoundary,
  DsnCircle,
  DsnPath,
  DsnPolygon,
  DsnRect,
  DsnStructure,
  SpectraDsn,
  generateSvgFromDsn,
} from "lib"

const normalizeSvg = async (svg: string) => stringify(await parse(svg))

const baseDsn = new SpectraDsn({
  designName: "svg-example",
  structure: new DsnStructure({
    boundary: new DsnBoundary({
      rects: [new DsnRect({ layer: "outline", x1: 0, y1: 0, x2: 40, y2: 20 })],
    }),
  }),
})

test("renders rectangular boundary to svg", async () => {
  const svg = generateSvgFromDsn(baseDsn)
  const normalized = await normalizeSvg(svg)

  const parsed = await parse(svg)
  expect(parsed.children.length).toBe(1)
  expect(parsed.children[0]?.name).toBe("rect")

  await expect(normalized).toMatchSvgSnapshot(
    import.meta.path,
    "rectangular-boundary",
  )
})

test("renders mixed boundary shapes", async () => {
  const dsn = new SpectraDsn({
    designName: "mixed-boundary",
    structure: new DsnStructure({
      boundary: new DsnBoundary({
        paths: [
          new DsnPath({
            layer: "outline",
            width: 2,
            coordinates: [0, 0, 30, 0, 30, 30, 0, 30],
          }),
        ],
        polygons: [
          new DsnPolygon({
            layer: "copper",
            apertureWidth: 1,
            coordinates: [10, 10, 20, 10, 20, 20, 10, 20],
          }),
        ],
        circles: [new DsnCircle({ layer: "drill", diameter: 6, x: 15, y: 15 })],
      }),
    }),
  })

  const svg = generateSvgFromDsn(dsn)
  const normalized = await normalizeSvg(svg)

  const parsed = await parse(svg)
  expect(parsed.children.map((child) => child.name)).toEqual([
    "path",
    "path",
    "circle",
  ])

  await expect(normalized).toMatchSvgSnapshot(
    import.meta.path,
    "mixed-boundary",
  )
})

test("parses DSN strings before generating svg", async () => {
  const svg = generateSvgFromDsn(
    `(pcb "string-source" (structure (boundary (rect Edge.Cuts 0 0 10 5))))`,
  )
  const normalized = await normalizeSvg(svg)

  const parsed = await parse(svg)
  expect(parsed.children.map((child) => child.name)).toEqual(["rect"])
  await expect(normalized).toMatchSvgSnapshot(import.meta.path, "string-source")
})
