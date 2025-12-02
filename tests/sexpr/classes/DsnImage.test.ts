import { DsnImage } from "lib/sexpr"
import { expect, test } from "bun:test"

test("DsnImage without quotes on image ID", () => {
  const image = new DsnImage({
    imageId: "Capacitor_THT:C_Disc_D4.7mm_W2.5mm_P5.00mm",
  })

  const output = image.getString()
  expect(output).toContain("(image Capacitor_THT:C_Disc_D4.7mm_W2.5mm_P5.00mm")
  expect(output).not.toContain('"Capacitor_THT:C_Disc_D4.7mm_W2.5mm_P5.00mm"')
})

test("DsnImage with colon in name", () => {
  const image = new DsnImage({
    imageId: "Capacitor_THT:C_Disc_D4.7mm_W2.5mm_P5.00mm",
  })

  expect(image.getString()).toBe(
    "(image Capacitor_THT:C_Disc_D4.7mm_W2.5mm_P5.00mm)",
  )
})

test("DsnImage with dots and underscores", () => {
  const image = new DsnImage({
    imageId: "SOT23-3_Package",
  })

  expect(image.getString()).toBe("(image SOT23-3_Package)")
})
