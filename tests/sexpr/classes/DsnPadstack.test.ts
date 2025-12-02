import { DsnPadstack } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnPadstack without quotes on padstack ID", () => {
  const padstack = new DsnPadstack({
    padstackId: "Round[A]Pad_1600_um",
  })

  const output = padstack.getString()
  expect(output).toContain("(padstack Round[A]Pad_1600_um")
  expect(output).not.toContain('"Round[A]Pad_1600_um"')
})

test("DsnPadstack with brackets in name", () => {
  const padstack = new DsnPadstack({
    padstackId: "Round[A]Pad_1200_um",
  })

  expect(padstack.getString()).toBe("(padstack Round[A]Pad_1200_um)")
})

test("DsnPadstack with complex name", () => {
  const padstack = new DsnPadstack({
    padstackId:
      "RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0",
  })

  expect(padstack.getString()).toBe(
    "(padstack RoundRect[T]Pad_540x640_135.514_um_0.000000_0_source_component_0)",
  )
})
