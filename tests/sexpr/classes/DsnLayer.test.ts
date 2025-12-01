import { DsnLayer, SpectraDsn, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnLayer with type and property", () => {
  // Parse within a DSN file context to use DsnLayer instead of Layer
  const [dsn] = SxClass.parse(
    `(pcb test
      (structure
        (layer F.Cu
          (type signal)
          (property
            (index 0)
          )
        )
      )
    )`,
  )

  expect(dsn).toBeInstanceOf(SpectraDsn)
  const spectraDsn = dsn as SpectraDsn
  const structure = spectraDsn.structure
  expect(structure).toBeDefined()

  const layers = structure!.layers
  expect(layers).toHaveLength(1)

  const layer = layers[0]!
  expect(layer).toBeInstanceOf(DsnLayer)
  expect(layer.layerName).toBe("F.Cu")
  expect(layer.type).toBe("signal")
  expect(layer.index).toBe(0)

  expect(layer.getString()).toMatchInlineSnapshot(`
    "(layer F.Cu
      (type signal)
      (property
        (index 0)
      )
    )"
  `)
})

test("DsnLayer construction via constructor", () => {
  const layer = new DsnLayer({
    layerName: "F.Cu",
    type: "signal",
    index: 0,
  })

  expect(layer.layerName).toBe("F.Cu")
  expect(layer.type).toBe("signal")
  expect(layer.index).toBe(0)

  expect(layer.getString()).toMatchInlineSnapshot(`
    "(layer F.Cu
      (type signal)
      (property
        (index 0)
      )
    )"
  `)
})

test("DsnLayer with different index", () => {
  const [dsn] = SxClass.parse(
    `(pcb test
      (structure
        (layer B.Cu
          (type signal)
          (property
            (index 1)
          )
        )
      )
    )`,
  )

  const spectraDsn = dsn as SpectraDsn
  const layer = spectraDsn.structure!.layers[0]!
  expect(layer.layerName).toBe("B.Cu")
  expect(layer.type).toBe("signal")
  expect(layer.index).toBe(1)
})

test("DsnLayer with minimal properties", () => {
  const layer = new DsnLayer({
    layerName: "F.Cu",
  })

  expect(layer.layerName).toBe("F.Cu")
  expect(layer.type).toBeUndefined()
  expect(layer.index).toBeUndefined()

  expect(layer.getString()).toMatchInlineSnapshot(`"(layer F.Cu)"`)
})

test("DsnLayer with only type", () => {
  const layer = new DsnLayer({
    layerName: "F.Cu",
    type: "signal",
  })

  expect(layer.layerName).toBe("F.Cu")
  expect(layer.type).toBe("signal")
  expect(layer.index).toBeUndefined()

  expect(layer.getString()).toMatchInlineSnapshot(`
    "(layer F.Cu
      (type signal)
    )"
  `)
})
