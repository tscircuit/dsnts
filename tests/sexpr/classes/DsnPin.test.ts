import { DsnPin } from "lib/sexpr"
import { SxClass } from "lib/sexpr/base-classes/SxClass"
import { test, expect } from "bun:test"

test("DsnPin without quotes on padstack ID", () => {
  const pin = new DsnPin({
    padstackId:
      "RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0",
    pinId: "1",
    x: -500,
    y: 0,
  })

  expect(pin.getString()).toBe(
    "(pin RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0 1 -500 0)",
  )
})

test("DsnPin with simple numeric pin ID", () => {
  const pin = new DsnPin({
    padstackId:
      "RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0",
    pinId: "1",
    x: -500,
    y: 0,
  })

  const output = pin.getString()
  expect(output).toBe(
    "(pin RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0 1 -500 0)",
  )
})

test("DsnPin with rotation", () => {
  const pin = new DsnPin({
    padstackId:
      "RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0",
    pinId: "1",
    x: -500,
    y: 0,
    rotation: 90,
  })

  expect(pin.getString()).toBe(
    "(pin RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0 1 -500 0 90)",
  )
})

test("DsnPin parses numeric pin_id correctly from DSN format", () => {
  // Format: (pin <padstack_id> <pin_id> <x> <y>)
  // Where pin_id is numeric (12), x is -2525, y is -6350
  const pin = DsnPin.fromSexprPrimitives([
    "Rect[T]Pad_3150.000000x1000.000000_um",
    12,
    -2525,
    -6350,
  ])

  expect(pin.padstackId).toBe("Rect[T]Pad_3150.000000x1000.000000_um")
  expect(pin.pinId).toBe("12")
  expect(pin.x).toBe(-2525)
  expect(pin.y).toBe(-6350)
  expect(pin.rotation).toBeUndefined()
})

test("DsnPin parses inline (rotate ...) expression correctly", () => {
  // Format: (pin <padstack_id> (rotate <angle>) <pin_id> <x> <y>)
  const pin = DsnPin.fromSexprPrimitives([
    "Round[T]Pad_1730.000000_um",
    ["rotate", 90],
    1,
    0,
    0,
  ])

  expect(pin.padstackId).toBe("Round[T]Pad_1730.000000_um")
  expect(pin.pinId).toBe("1")
  expect(pin.x).toBe(0)
  expect(pin.y).toBe(0)
  expect(pin.rotation).toBe(90)
})

test("DsnPin parses rotation at end of expression", () => {
  // Format: (pin <padstack_id> <pin_id> <x> <y> <rotation>)
  const pin = DsnPin.fromSexprPrimitives([
    "Rect[T]Pad_1000x1000_um",
    "A1",
    100,
    200,
    45,
  ])

  expect(pin.padstackId).toBe("Rect[T]Pad_1000x1000_um")
  expect(pin.pinId).toBe("A1")
  expect(pin.x).toBe(100)
  expect(pin.y).toBe(200)
  expect(pin.rotation).toBe(45)
})
