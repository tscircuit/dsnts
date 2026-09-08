import { test } from "bun:test"
import { strict as assert } from "node:assert"
import {
  parseToPrimitiveSExpr,
  printSExpr,
} from "../lib/sexpr/parseToPrimitiveSExpr"

for (const value of ["0", "001", "-2", "+3", ".5", "1.", "1e3", ";note"]) {
  test(`printing preserves string atom ${JSON.stringify(value)}`, () => {
    assert.deepEqual(parseToPrimitiveSExpr(printSExpr(value)), [value])
    assert.deepEqual(parseToPrimitiveSExpr(printSExpr(["net", value])), [
      ["net", value],
    ])
  })
}

for (const value of ["board", "R1", "1k", "foo-bar"]) {
  test(`ordinary symbols stay bare: ${value}`, () => {
    assert.equal(printSExpr(value), value)
    assert.deepEqual(parseToPrimitiveSExpr(printSExpr(value)), [value])
  })
}

test("numbers, booleans, nil and reserved strings retain their types", () => {
  const values = [0, 1.5, true, false, null, "nil", "#t", "#f"]
  assert.deepEqual(parseToPrimitiveSExpr(printSExpr(values)), [values])
})
