import { test } from "bun:test"
import { strict as assert } from "node:assert"
import { SxClass } from "../lib/sexpr/base-classes/SxClass"
import type { PrimitiveSExpr } from "../lib/sexpr/parseToPrimitiveSExpr"

class TestProperty extends SxClass {
  static override token = "test_null_property"
  token = "test_null_property"
  value = 0

  static override fromSexprPrimitives(values: PrimitiveSExpr[]): TestProperty {
    const property = new TestProperty()
    property.value = Number(values[0])
    return property
  }
}
SxClass.register(TestProperty)

test("nil-only input produces no class properties", () => {
  assert.deepEqual(SxClass.parsePrimitivesToClassProperties([null]), {
    propertyMap: {},
    arrayPropertyMap: {},
  })
})

test("nil can surround real class properties", () => {
  const { propertyMap } = SxClass.parsePrimitivesToClassProperties([
    null,
    ["test_null_property", 7],
    null,
  ])
  assert.equal((propertyMap.test_null_property as TestProperty).value, 7)
})

test("nil does not interrupt repeated-property collection", () => {
  const { propertyMap, arrayPropertyMap } =
    SxClass.parsePrimitivesToClassProperties([
      ["test_null_property", 1],
      null,
      ["test_null_property", 2],
    ])
  assert.equal((propertyMap.test_null_property as TestProperty).value, 2)
  const values = arrayPropertyMap.test_null_property!.map(
    (property) => (property as TestProperty).value,
  )
  assert.deepEqual(values, [1, 2])
})

test("ordinary non-class atoms and empty input stay ignored", () => {
  for (const values of [[], ["plain", 42, true, false]] as PrimitiveSExpr[][]) {
    assert.deepEqual(SxClass.parsePrimitivesToClassProperties(values), {
      propertyMap: {},
      arrayPropertyMap: {},
    })
  }
})

test("unknown class tokens are still rejected", () => {
  assert.throws(
    () => SxClass.parsePrimitivesToClassProperties([["not_registered_here"]]),
    /not registered/,
  )
})
