import { test } from "bun:test"
import { strict as assert } from "node:assert"
import { DsnCircle } from "../lib/sexpr/classes/DsnCircle"
import { SxClass } from "../lib/sexpr/base-classes/SxClass"

for (const layer of ["F.Cu", 0]) {
  for (const position of [{ y: 5 }, { x: -3 }, { y: 0 }, { x: 2, y: -4 }]) {
    test(`circle coordinate pair ${layer} ${JSON.stringify(position)}`, () => {
      const circle = new DsnCircle({ layer, diameter: 10, ...position })
      const expected = [position.x ?? 0, position.y ?? 0]
      const source = circle.getString()
      const parsed = SxClass.parse(source)[0] as DsnCircle
      assert.deepEqual([parsed.x, parsed.y], expected)
      assert.equal(parsed.layer, layer)
      assert.equal(parsed.diameter, 10)
      assert.equal(parsed.getString(), source)
      assert.deepEqual([circle.x, circle.y], [position.x, position.y])
    })
  }
}

test("an omitted center stays omitted", () => {
  const circle = new DsnCircle({ layer: "signal", diameter: 10 })
  assert.equal(circle.getString(), "(circle signal 10 )")
  const parsed = SxClass.parse(circle.getString())[0] as DsnCircle
  assert.equal(parsed.x, undefined)
  assert.equal(parsed.y, undefined)
})

test("setting and removing optional coordinates keeps positional slots", () => {
  const circle = new DsnCircle({ layer: "signal", diameter: 10 })
  circle.y = -7
  assert.equal(circle.getString(), "(circle signal 10 0 -7 )")
  circle.x = 4
  assert.equal(circle.getString(), "(circle signal 10 4 -7 )")
  circle.y = undefined
  assert.equal(circle.getString(), "(circle signal 10 4 0 )")
  circle.x = undefined
  assert.equal(circle.getString(), "(circle signal 10 )")
})
