import { test } from "bun:test"
import { strict as assert } from "node:assert"
import {
  parseToPrimitiveSExpr,
  tokenize,
} from "../lib/sexpr/parseToPrimitiveSExpr"

const unterminated = [
  '"',
  String.raw`"abc\"`,
  String.raw`"\"`,
  String.raw`"abc\\\"`,
]

for (const input of unterminated) {
  test(`rejects a missing closing quote: ${JSON.stringify(input)}`, () => {
    assert.throws(() => tokenize(input), {
      name: "SyntaxError",
      message: "Unterminated string literal",
    })
    assert.throws(() => parseToPrimitiveSExpr(input), {
      name: "SyntaxError",
      message: "Unterminated string literal",
    })
  })
}

const valid: [string, string][] = [
  ['""', ""],
  ['"board"', "board"],
  [String.raw`"a\"b"`, 'a"b'],
  [String.raw`"ends\\"`, "ends\\"],
  [String.raw`"abc\""`, 'abc"'],
]

for (const [input, value] of valid) {
  test(`preserves a real closing quote: ${JSON.stringify(input)}`, () => {
    assert.deepEqual(tokenize(input), [{ type: "string", value }])
    assert.deepEqual(parseToPrimitiveSExpr(input), [value])
  })
}

test("unterminated escapes keep their specific diagnostic", () => {
  assert.throws(() => tokenize('"abc' + "\\"), {
    name: "SyntaxError",
    message: "Unterminated escape in string",
  })
})

test("a trailing incomplete string does not return earlier complete forms", () => {
  assert.throws(
    () => parseToPrimitiveSExpr("(pcb board) " + String.raw`"abc\"`),
    SyntaxError,
  )
})

test("the DSN bare string_quote declaration remains supported", () => {
  assert.deepEqual(parseToPrimitiveSExpr('(parser (string_quote "))'), [
    ["parser", ["string_quote", '"']],
  ])
})
