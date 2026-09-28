import { expect, test } from "bun:test"
import { DsnPath, DsnPolygon, DsnRect } from "lib/sexpr"
import { SxClass } from "lib/sexpr/base-classes/SxClass"

// Issue #21: numeric-looking layer names must survive a
// getString() -> SxClass.parse() round-trip
for (const layer of ["0", "1", "2", "signal", "F.Cu"]) {
  test(`rect layer ${layer}`, () => {
    const source = new DsnRect({ layer, x1: 10, y1: 20, x2: 30, y2: 40 })
    const parsed = SxClass.parse(source.getString())[0] as DsnRect
    expect([parsed.layer, parsed.x1, parsed.y1, parsed.x2, parsed.y2]).toEqual([
      layer,
      10,
      20,
      30,
      40,
    ])
  })

  test(`path layer ${layer}`, () => {
    const source = new DsnPath({
      layer,
      width: 5,
      coordinates: [10, 20, 30, 40],
    })
    const parsed = SxClass.parse(source.getString())[0] as DsnPath
    expect([parsed.layer, parsed.width, parsed.coordinates]).toEqual([
      layer,
      5,
      [10, 20, 30, 40],
    ])
  })

  test(`polygon layer ${layer}`, () => {
    const source = new DsnPolygon({
      layer,
      apertureWidth: 0,
      coordinates: [10, 20, 30, 40, 50, 60],
    })
    const parsed = SxClass.parse(source.getString())[0] as DsnPolygon
    expect([parsed.layer, parsed.apertureWidth, parsed.coordinates]).toEqual([
      layer,
      0,
      [10, 20, 30, 40, 50, 60],
    ])
  })
}

// Real .ses files use bare numeric layer names, e.g. (path 1 1772 ...)
test("parses numeric layer from external SES syntax", () => {
  const path = SxClass.parse(
    "(path 1 1772 45016 -138866 19999 -113849)",
  )[0] as DsnPath
  expect(path.layer).toBe("1")
  expect(path.width).toBe(1772)
  expect(path.coordinates).toEqual([45016, -138866, 19999, -113849])

  const rect = SxClass.parse("(rect 2 10 20 30 40)")[0] as DsnRect
  expect(rect.layer).toBe("2")
  expect([rect.x1, rect.y1, rect.x2, rect.y2]).toEqual([10, 20, 30, 40])
})
