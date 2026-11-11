import { strict as assert } from "node:assert"
import { DsnLayer, parseSpectraDsn } from "../../lib/sexpr"
import { parseToPrimitiveSExpr } from "../../lib/sexpr/parseToPrimitiveSExpr"

// Layer declarations from FreeRouting's Issue313-FastTest.dsn, which is
// included in this repository's download-demos.ts list:
// https://github.com/freerouting/freerouting/blob/master/fixtures/Issue313-FastTest.dsn
const numericLayerBoard = `(pcb "numeric-layer-declarations"
  (structure
    (layer 1 (type signal))
    (layer 2 (type signal))
  )
)`

export const numericLayerNameCases: { name: string; run: () => void }[] = [
  {
    name: "numeric layer declarations survive a complete DSN round-trip",
    run: () => {
      const board = parseSpectraDsn(numericLayerBoard)
      assert.deepEqual(
        board.structure!.layers.map((layer) => [layer.layerName, layer.type]),
        [
          ["1", "signal"],
          ["2", "signal"],
        ],
      )

      const serialized = board.getString()
      assert.deepEqual(parseToPrimitiveSExpr(serialized), [
        [
          "pcb",
          "numeric-layer-declarations",
          [
            "structure",
            ["layer", 1, ["type", "signal"]],
            ["layer", 2, ["type", "signal"]],
          ],
        ],
      ])
      assert.deepEqual(
        parseSpectraDsn(serialized).structure!.layers.map(
          (layer) => layer.layerName,
        ),
        ["1", "2"],
      )
    },
  },
  {
    name: "zero remains a layer name rather than an absent value",
    run: () => {
      const board = parseSpectraDsn('(pcb "zero" (structure (layer 0)))')
      assert.equal(board.structure!.layers[0]!.layerName, "0")
      assert.equal(board.structure!.layers[0]!.getString(), "(layer 0)")
      assert.equal(
        parseSpectraDsn(board.getString()).structure!.layers[0]!.layerName,
        "0",
      )
    },
  },
  {
    name: "constructed numeric layer names survive the public parse API",
    run: () => {
      const layer = new DsnLayer({ layerName: "2", type: "signal", index: 0 })
      const board = parseSpectraDsn(
        `(pcb "constructed" (structure ${layer.getString()}))`,
      )
      const parsed = board.structure!.layers[0]!
      assert.deepEqual(
        [parsed.layerName, parsed.type, parsed.index],
        ["2", "signal", 0],
      )
    },
  },
  {
    name: "ordinary layer names keep their type, index and formatting",
    run: () => {
      const board = parseSpectraDsn(`(pcb "named"
        (structure (layer F.Cu (type signal) (property (index 0)))))`)
      const layer = board.structure!.layers[0]!
      assert.deepEqual(
        [layer.layerName, layer.type, layer.index],
        ["F.Cu", "signal", 0],
      )
      assert.equal(
        layer.getString(),
        "(layer F.Cu\n  (type signal)\n  (property\n    (index 0)\n  )\n)",
      )
      assert.equal(
        parseSpectraDsn(board.getString()).structure!.layers[0]!.layerName,
        "F.Cu",
      )
    },
  },
  {
    name: "nested indices do not become an omitted layer name",
    run: () => {
      const layer = DsnLayer.fromSexprPrimitives([
        ["type", "signal"],
        ["property", ["index", 3]],
      ])
      assert.equal(layer.layerName, undefined)
      assert.equal(layer.type, "signal")
      assert.equal(layer.index, 3)
    },
  },
]
