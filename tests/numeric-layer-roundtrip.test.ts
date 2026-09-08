import { test } from "bun:test"
import { strict as assert } from "node:assert"
import { SxClass } from "../lib/sexpr/base-classes/SxClass"
import { DsnRect } from "../lib/sexpr/classes/DsnRect"
import { DsnPath } from "../lib/sexpr/classes/DsnPath"

for (const layer of ["0", "1", "001", "-2", ".5", "1e2", "signal", "F.Cu"]) {
  test(`rectangle preserves string layer ${layer} and coordinates`, () => {
    const source = new DsnRect({ layer, x1: 10, y1: 20, x2: 30, y2: 40 })
    const text = source.getString()
    const parsed = SxClass.parse(text)[0] as DsnRect
    assert.deepEqual(
      [parsed.layer, parsed.x1, parsed.y1, parsed.x2, parsed.y2],
      [layer, 10, 20, 30, 40],
    )
    assert.equal(parsed.getString(), text)
    assert.equal(source.layer, layer)
  })

  test(`path preserves string layer ${layer}, width and coordinates`, () => {
    const source = new DsnPath({
      layer,
      width: 5,
      coordinates: [10, 20, 30, 40],
    })
    const text = source.getString()
    const parsed = SxClass.parse(text)[0] as DsnPath
    assert.deepEqual(
      [parsed.layer, parsed.width, parsed.coordinates],
      [layer, 5, [10, 20, 30, 40]],
    )
    assert.equal(parsed.getString(), text)
  })
}

test("ordinary layer spellings retain the exact serialized form", () => {
  const rect = new DsnRect({ layer: "F.Cu", x1: 0, y1: 0, x2: 10, y2: 20 })
  const path = new DsnPath({ layer: "signal", width: 0, coordinates: [0, 1] })
  assert.equal(rect.getString(), "(rect F.Cu 0 0 10 20 )")
  assert.equal(path.getString(), "(path signal 0 0 1 )")
})
