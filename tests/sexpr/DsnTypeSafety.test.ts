import { describe, expect, test } from "bun:test"
import {
  DsnClass,
  DsnComponent,
  DsnImage,
  DsnLibrary,
  DsnNet,
  DsnNetwork,
  DsnPadstack,
  DsnPlacement,
  DsnResolution,
  DsnWire,
  DsnWiring,
  parseSpectraDsn,
  SpectraDsn,
} from "lib/sexpr"

describe("DSN Type Safety - Specific Typed Arrays", () => {
  test("DsnLibrary has typed images and padstacks arrays", () => {
    const library = new DsnLibrary({
      images: [
        new DsnImage({ imageId: "SOT23-3" }),
        new DsnImage({ imageId: "QFN-16" }),
      ],
      padstacks: [
        new DsnPadstack({ padstackId: "round_50" }),
        new DsnPadstack({ padstackId: "rect_100x80" }),
      ],
    })

    expect(library.images).toHaveLength(2)
    expect(library.images[0]).toBeInstanceOf(DsnImage)
    expect(library.images[0]?.imageId).toBe("SOT23-3")

    expect(library.padstacks).toHaveLength(2)
    expect(library.padstacks[0]).toBeInstanceOf(DsnPadstack)
    expect(library.padstacks[0]?.padstackId).toBe("round_50")

    // otherChildren should be empty
    expect(library.otherChildren).toHaveLength(0)
  })

  test("DsnNetwork has typed nets and classes arrays", () => {
    const network = new DsnNetwork({
      nets: [
        new DsnNet({ netName: "GND", pins: ["U1-1", "C1-2"] }),
        new DsnNet({ netName: "VCC", pins: ["U1-2", "C2-1"] }),
      ],
      classes: [new DsnClass({ className: "POWER", netNames: ["VCC", "GND"] })],
    })

    expect(network.nets).toHaveLength(2)
    expect(network.nets[0]).toBeInstanceOf(DsnNet)
    expect(network.nets[0]?.netName).toBe("GND")
    expect(network.nets[0]?.pins).toEqual(["U1-1", "C1-2"])

    expect(network.classes).toHaveLength(1)
    expect(network.classes[0]).toBeInstanceOf(DsnClass)
    expect(network.classes[0]?.className).toBe("POWER")

    // otherChildren should be empty
    expect(network.otherChildren).toHaveLength(0)
  })

  test("DsnPlacement has typed components array", () => {
    const placement = new DsnPlacement({
      resolution: new DsnResolution("mil", 10),
      components: [
        new DsnComponent({ imageId: "SOT23-3" }),
        new DsnComponent({ imageId: "QFN-16" }),
      ],
    })

    expect(placement.components).toHaveLength(2)
    expect(placement.components[0]).toBeInstanceOf(DsnComponent)
    expect(placement.components[0]?.imageId).toBe("SOT23-3")

    expect(placement.resolution).toBeInstanceOf(DsnResolution)
    expect(placement.resolution?.unit).toBe("mil")

    // otherChildren should be empty
    expect(placement.otherChildren).toHaveLength(0)
  })

  test("DsnWiring has typed wires array", () => {
    const wiring = new DsnWiring({
      wires: [
        new DsnWire({ netId: "GND", width: 10, layer: "TOP" }),
        new DsnWire({ netId: "VCC", width: 15, layer: "BOTTOM" }),
      ],
    })

    expect(wiring.wires).toHaveLength(2)
    expect(wiring.wires[0]).toBeInstanceOf(DsnWire)
    expect(wiring.wires[0]?.netId).toBe("GND")
    expect(wiring.wires[0]?.width).toBe(10)
    expect(wiring.wires[0]?.layer).toBe("TOP")

    // otherChildren should be empty
    expect(wiring.otherChildren).toHaveLength(0)
  })

  test("Parsing DSN file with library populates typed arrays", () => {
    const input = `(pcb "test"
  (library
    (image "SOT23-3")
    (image "QFN-16")
    (padstack "round_50")
  )
)`

    const parsed = parseSpectraDsn(input)
    const library = parsed.library

    expect(library).toBeInstanceOf(DsnLibrary)
    expect(library?.images).toHaveLength(2)
    expect(library?.images[0]?.imageId).toBe("SOT23-3")
    expect(library?.images[1]?.imageId).toBe("QFN-16")
    expect(library?.padstacks).toHaveLength(1)
    expect(library?.padstacks[0]?.padstackId).toBe("round_50")
  })

  test("Parsing DSN file with network populates typed arrays", () => {
    const input = `(pcb "test"
  (network
    (net "GND" "U1-1" "C1-2")
    (net "VCC" "U1-2")
    (class "POWER" "VCC" "GND")
  )
)`

    const parsed = parseSpectraDsn(input)
    const network = parsed.network

    expect(network).toBeInstanceOf(DsnNetwork)
    expect(network?.nets).toHaveLength(2)
    expect(network?.nets[0]?.netName).toBe("GND")
    expect(network?.nets[0]?.pins).toEqual(["U1-1", "C1-2"])
    expect(network?.classes).toHaveLength(1)
    expect(network?.classes[0]?.className).toBe("POWER")
    expect(network?.classes[0]?.netNames).toEqual(["VCC", "GND"])
  })

  test("SpectraDsn has typed properties with no generic SxClass arrays at root", () => {
    const dsn = new SpectraDsn({
      designName: "test",
      library: new DsnLibrary({
        images: [new DsnImage({ imageId: "SOT23-3" })],
      }),
      network: new DsnNetwork({
        nets: [new DsnNet({ netName: "GND" })],
      }),
      placement: new DsnPlacement({
        components: [new DsnComponent({ imageId: "SOT23-3" })],
      }),
      wiring: new DsnWiring({
        wires: [new DsnWire({ netId: "GND" })],
      }),
    })

    // All major sections should be properly typed
    expect(dsn.library).toBeInstanceOf(DsnLibrary)
    expect(dsn.network).toBeInstanceOf(DsnNetwork)
    expect(dsn.placement).toBeInstanceOf(DsnPlacement)
    expect(dsn.wiring).toBeInstanceOf(DsnWiring)

    // Nested typed arrays
    expect(dsn.library?.images[0]).toBeInstanceOf(DsnImage)
    expect(dsn.network?.nets[0]).toBeInstanceOf(DsnNet)
    expect(dsn.placement?.components[0]).toBeInstanceOf(DsnComponent)
    expect(dsn.wiring?.wires[0]).toBeInstanceOf(DsnWire)
  })

  test("Round-trip preserves typed structure", () => {
    const original = new SpectraDsn({
      designName: "test_board",
      library: new DsnLibrary({
        images: [new DsnImage({ imageId: "SOT23-3" })],
        padstacks: [new DsnPadstack({ padstackId: "round_50" })],
      }),
      network: new DsnNetwork({
        nets: [new DsnNet({ netName: "GND", pins: ["U1-1"] })],
      }),
    })

    const serialized = original.getString()
    const parsed = parseSpectraDsn(serialized)

    expect(parsed.library?.images).toHaveLength(1)
    expect(parsed.library?.images[0]?.imageId).toBe("SOT23-3")
    expect(parsed.library?.padstacks).toHaveLength(1)
    expect(parsed.library?.padstacks[0]?.padstackId).toBe("round_50")
    expect(parsed.network?.nets).toHaveLength(1)
    expect(parsed.network?.nets[0]?.netName).toBe("GND")
    expect(parsed.network?.nets[0]?.pins).toEqual(["U1-1"])
  })
})
