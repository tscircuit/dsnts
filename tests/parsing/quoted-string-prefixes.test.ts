import { expect, test } from "bun:test"
import { parseToPrimitiveSExpr as parseSExpr } from "../../lib/sexpr/parseToPrimitiveSExpr"
import { quoteSExprString } from "../../lib/sexpr/utils/quoteSExprString"

for (const value of [
  " leading space",
  ")leading parenthesis",
  " ",
  "\tleading tab",
]) {
  test(`quoted string round-trip: ${JSON.stringify(value)}`, () => {
    expect(parseSExpr(`(name ${quoteSExprString(value)})`)).toEqual([
      ["name", value],
    ])
  })
}

test("an actual tab after an opening quote remains part of the string", () => {
  expect(parseSExpr('(name "\tboard")')).toEqual([["name", "\tboard"]])
})

test("DSN's bare string_quote declaration is still supported", () => {
  expect(
    parseSExpr('(parser (string_quote ") (space_in_quoted_tokens on))'),
  ).toEqual([
    ["parser", ["string_quote", '"'], ["space_in_quoted_tokens", "on"]],
  ])
  expect(parseSExpr('(STRING_QUOTE " )')).toEqual([["STRING_QUOTE", '"']])
})
