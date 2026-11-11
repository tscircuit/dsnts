import { test } from "bun:test"
import { numericLayerNameCases } from "../../fixtures/numeric-layer-name-cases"

for (const { name, run } of numericLayerNameCases) {
  test(name, run)
}
