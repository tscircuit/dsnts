import { DsnPin } from "lib/sexpr"
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
