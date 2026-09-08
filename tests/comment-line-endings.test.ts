import { test } from "bun:test"
import { strict as assert } from "node:assert"
import {
  parseToPrimitiveSExpr,
  tokenize,
} from "../lib/sexpr/parseToPrimitiveSExpr"

for (const eol of ["\n", "\r\n", "\r"]) {
  test(`comments end at ${JSON.stringify(eol)}`, () => {
    const source = `; header${eol}(pcb board)${eol}; middle${eol}(unit mm)`
    assert.deepEqual(parseToPrimitiveSExpr(source), [
      ["pcb", "board"],
      ["unit", "mm"],
    ])
  })

  test(`comments inside a list: ${JSON.stringify(eol)}`, () => {
    const source = `(net ; annotation${eol}signal)`
    assert.deepEqual(parseToPrimitiveSExpr(source), [["net", "signal"]])
  })
}

test("a comment at EOF remains ignored", () => {
  const source = "(unit mm) ; trailing"
  assert.deepEqual(parseToPrimitiveSExpr(source), [["unit", "mm"]])
  assert.deepEqual(tokenize("; comment only"), [])
})

test("carriage returns inside strings remain data", () => {
  assert.deepEqual(parseToPrimitiveSExpr('"a;\rb"'), ["a;\rb"])
})
