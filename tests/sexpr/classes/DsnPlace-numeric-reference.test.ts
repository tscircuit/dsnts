import { expect, test } from "bun:test"
import { DsnPlace, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

for (const componentRef of ["42", "0", "-12", "U1"]) {
  test(`DsnPlace round-trips reference ${componentRef} without shifting coordinates`, () => {
    const original = new DsnPlace({
      componentRef,
      x: 100,
      y: -200,
      side: "back",
      rotation: 90,
    })
    const place = SxClass.parsePrimitiveSexpr(
      parseToPrimitiveSExpr(original.getString())[0]!,
      { parentToken: "component" },
    )

    expect(place).toBeInstanceOf(DsnPlace)
    expect((place as DsnPlace).componentRef).toBe(componentRef)
    expect((place as DsnPlace).x).toBe(100)
    expect((place as DsnPlace).y).toBe(-200)
    expect((place as DsnPlace).side).toBe("back")
    expect((place as DsnPlace).rotation).toBe(90)
  })
}
