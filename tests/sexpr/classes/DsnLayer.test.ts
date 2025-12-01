import { DsnLayer, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnLayer with type and property", () => {
  const [layer] = SxClass.parse(
    `(layer F.Cu
      (type signal)
      (property
        (index 0)
      )
    )`,
  )

  expect(layer).toBeInstanceOf(DsnLayer)
  const dsnLayer = layer as DsnLayer
  expect(dsnLayer.layerName).toBe("F.Cu")
  expect(dsnLayer.type).toBe("signal")
  expect(dsnLayer.index).toBe(0)

  expect(dsnLayer.getString()).toMatchInlineSnapshot(`
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
  const [layer] = SxClass.parse(
    `(layer B.Cu
      (type signal)
      (property
        (index 1)
      )
    )`,
  )

  const dsnLayer = layer as DsnLayer
  expect(dsnLayer.layerName).toBe("B.Cu")
  expect(dsnLayer.type).toBe("signal")
  expect(dsnLayer.index).toBe(1)
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
