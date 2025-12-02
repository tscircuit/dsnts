import { DsnPins } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnPins without quotes on pin refs", () => {
  const pins = new DsnPins({
    pinRefs: ["J3-D+", "J1-D+"],
  })

  const output = pins.getString()
  expect(output).toBe("(pins J3-D+ J1-D+)")
  expect(output).not.toContain('"J3-D+"')
})

test("DsnPins with component and pin references", () => {
  const pins = new DsnPins({
    pinRefs: ["U1-1", "R1-2"],
  })

  expect(pins.getString()).toBe("(pins U1-1 R1-2)")
})

test("DsnPins with single pin ref", () => {
  const pins = new DsnPins({
    pinRefs: ["C1-1"],
  })

  expect(pins.getString()).toBe("(pins C1-1)")
})

test("DsnPins empty", () => {
  const pins = new DsnPins()

  expect(pins.getString()).toBe("(pins)")
})
