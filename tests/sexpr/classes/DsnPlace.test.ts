import { DsnPlace } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnPlace without quotes on component reference", () => {
  const place = new DsnPlace({
    componentRef: "pcb_component_1",
    x: -2560.0000000000005,
    y: 0,
    side: "front",
    rotation: 180,
  })

  const output = place.getString()
  expect(output).toBe(
    "(place pcb_component_1 -2560.0000000000005 0 front 180 )",
  )
  expect(output).not.toContain('"pcb_component_1"')
})

test("DsnPlace with all parameters", () => {
  const place = new DsnPlace({
    componentRef: "U1",
    x: 100,
    y: 200,
    side: "back",
    rotation: 90,
  })

  expect(place.getString()).toBe("(place U1 100 200 back 90 )")
})

test("DsnPlace with minimal parameters", () => {
  const place = new DsnPlace({
    componentRef: "C1",
    x: 0,
    y: 0,
  })

  expect(place.getString()).toBe("(place C1 0 0 )")
})

test("DsnPlace with only component reference", () => {
  const place = new DsnPlace({
    componentRef: "R1",
  })

  expect(place.getString()).toBe("(place R1 )")
})

test("DsnPlace empty", () => {
  const place = new DsnPlace()

  expect(place.getString()).toBe("(place )")
})

test("DsnPlace with decimal coordinates", () => {
  const place = new DsnPlace({
    componentRef: "J1",
    x: 12.345,
    y: -67.89,
    side: "front",
    rotation: 0,
  })

  expect(place.getString()).toBe("(place J1 12.345 -67.89 front 0 )")
})
