import { expect, test } from "bun:test"
import { parseSync } from "svgson"
import { parseSpectraDsn } from "lib/sexpr"
import { generateSvgFromDsn } from "lib/svg/generateSvgFromDsn"

const board = (width: number) =>
  parseSpectraDsn(`(pcb outline (structure
    (boundary (path pcb ${width} 0 0 40 0 40 20 0 20 0 0))))`)

const lineWidth = (svg: string) =>
  parseSync(svg).children.find((node) => node.name === "polyline")?.attributes[
    "stroke-width"
  ]

test("zero-width DSN boundary paths get a visible default outline", async () => {
  const dsn = board(0)
  const svg = generateSvgFromDsn(dsn)
  expect(lineWidth(svg)).toBe("1")
  expect(dsn.structure?.boundary?.paths[0]?.width).toBe(0)
  await expect(svg).toMatchSvgSnapshot(import.meta.path, "zero-width-boundary")
})

test("zero-width boundaries use a requested display stroke width", () => {
  expect(lineWidth(generateSvgFromDsn(board(0), { strokeWidth: 3 }))).toBe("3")
})

test("positive DSN path widths keep their existing precedence", () => {
  expect(lineWidth(generateSvgFromDsn(board(2), { strokeWidth: 3 }))).toBe("2")
})

test("callers can still explicitly request an invisible display stroke", () => {
  expect(lineWidth(generateSvgFromDsn(board(0), { strokeWidth: 0 }))).toBe("0")
})
