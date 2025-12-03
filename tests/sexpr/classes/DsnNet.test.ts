import { DsnNet, DsnPins } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnNet with net name on same line as opening parenthesis", () => {
  const net = new DsnNet({
    netName: "Net-(pcb_component_0-Pad1)",
  })

  const output = net.getString()

  // Net name should be on the same line as (net
  expect(output).toContain('(net "Net-(pcb_component_0-Pad1)"')
  expect(output).not.toContain('(net\n  "Net-(pcb_component_0-Pad1)"')
})

test("DsnNet with pins child element", () => {
  const net = new DsnNet({
    netName: "Net-(pcb_component_0-Pad1)",
    otherChildren: [
      new DsnPins({
        pinRefs: ["pcb_component_0-1", "pcb_component_1-1"],
      }),
    ],
  })

  const output = net.getString()
  const expected = `(net "Net-(pcb_component_0-Pad1)"
  (pins pcb_component_0-1 pcb_component_1-1)
)`

  expect(output).toBe(expected)
})

test("DsnNet with inline pin references", () => {
  const net = new DsnNet({
    netName: "GND",
    pins: ["U1-1", "C1-2", "R1-1"],
  })

  const output = net.getString()
  const expected = `(net "GND"
  "U1-1"
  "C1-2"
  "R1-1"
)`

  expect(output).toBe(expected)
})

test("DsnNet without net name", () => {
  const net = new DsnNet({
    pins: ["U1-1", "C1-2"],
  })

  const output = net.getString()
  expect(output).toContain("(net\n")
  expect(output).toContain('"U1-1"')
  expect(output).toContain('"C1-2"')
})

test("DsnNet empty", () => {
  const net = new DsnNet()

  expect(net.getString()).toBe("(net\n)")
})
