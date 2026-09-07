import { expect, test } from "bun:test"
import {
  DsnImage,
  DsnPadstack,
  DsnPin,
  DsnPlace,
  DsnShape,
  SxClass,
} from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

const reparse = (value: SxClass, parentToken: string) =>
  SxClass.parsePrimitiveSexpr(parseToPrimitiveSExpr(value.getString())[0]!, {
    parentToken,
  })

for (const name of [
  "custom pad",
  "pad(oval)",
  'pad"quoted',
  "pad\\custom",
  ";comment",
  "nil",
]) {
  test(`library identifiers survive serialization: ${JSON.stringify(name)}`, () => {
    const image = new DsnImage({ imageId: name })
    expect((reparse(image, "library") as DsnImage).imageId).toBe(name)
    const padstack = new DsnPadstack({ padstackId: name })
    expect((reparse(padstack, "library") as DsnPadstack).padstackId).toBe(name)
  })

  test(`pin and placement references survive serialization: ${JSON.stringify(name)}`, () => {
    const pin = new DsnPin({ padstackId: name, pinId: name, x: 12, y: 34 })
    const parsedPin = reparse(pin, "image") as DsnPin
    expect(parsedPin.padstackId).toBe(name)
    expect(parsedPin.pinId).toBe(name)
    expect([parsedPin.x, parsedPin.y]).toEqual([12, 34])

    const place = new DsnPlace({
      componentRef: name,
      x: 12,
      y: 34,
      side: "front",
      rotation: 90,
    })
    const parsedPlace = reparse(place, "component") as DsnPlace
    expect(parsedPlace.componentRef).toBe(name)
    expect([
      parsedPlace.x,
      parsedPlace.y,
      parsedPlace.side,
      parsedPlace.rotation,
    ]).toEqual([12, 34, "front", 90])
  })
}

test("library identifiers are also escaped when their elements have children", () => {
  const image = new DsnImage({
    imageId: "package (custom)",
    pins: [new DsnPin({ padstackId: "pad custom", pinId: "A1", x: 0, y: 0 })],
  })
  const padstack = new DsnPadstack({
    padstackId: "pad custom",
    shapes: [new DsnShape()],
  })
  expect((reparse(padstack, "library") as DsnPadstack).padstackId).toBe(
    padstack.padstackId,
  )
  expect((reparse(padstack, "library") as DsnPadstack).shapes).toHaveLength(1)
  expect((reparse(image, "library") as DsnImage).imageId).toBe(image.imageId)
  expect((reparse(image, "library") as DsnImage).pins[0]?.padstackId).toBe(
    padstack.padstackId,
  )
})
