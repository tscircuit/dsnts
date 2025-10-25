import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnOutline } from "./DsnOutline"
import { DsnPin } from "./DsnPin"

/**
 * DsnImage represents an (image ...) definition in the library section.
 * Images are the DSN equivalent of footprints/packages.
 * They define the physical layout including outline, pins, and keepouts.
 *
 * Format: (image <image_id> ...)
 * Example: (image "SOT23-3" ...)
 *
 * Children can include:
 * - outline: Shape outline
 * - pin: Pin definitions
 * - keepout: Keepout areas
 * - property: Image properties
 */
export interface DsnImageConstructorParams {
  imageId?: string
  outlines?: DsnOutline[]
  pins?: DsnPin[]
  otherChildren?: SxClass[]
}

export class DsnImage extends SxClass {
  static override token = "image"
  static override parentToken = "library"
  token = "image"

  private _imageId?: string
  private _outlines: DsnOutline[] = []
  private _pins: DsnPin[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnImageConstructorParams = {}) {
    super()
    if (params.imageId !== undefined) this.imageId = params.imageId
    if (params.outlines !== undefined) this.outlines = params.outlines
    if (params.pins !== undefined) this.pins = params.pins
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnImage {
    const image = new DsnImage()

    // First primitive is the image ID
    if (
      primitiveSexprs.length > 0 &&
      typeof primitiveSexprs[0] === "string"
    ) {
      image.imageId = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnImage.token,
      })

      if (parsed instanceof SxClass) {
        image.consumeChild(parsed)
      }
    }

    return image
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnOutline) {
      this._outlines.push(child)
      return
    }
    if (child instanceof DsnPin) {
      this._pins.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get imageId(): string | undefined {
    return this._imageId
  }

  set imageId(value: string | undefined) {
    this._imageId = value
  }

  get outlines(): DsnOutline[] {
    return [...this._outlines]
  }

  set outlines(value: DsnOutline[]) {
    this._outlines = [...value]
  }

  get pins(): DsnPin[] {
    return [...this._pins]
  }

  set pins(value: DsnPin[]) {
    this._pins = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._outlines)
    children.push(...this._pins)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    if (this._imageId) {
      lines.push(`  ${JSON.stringify(this._imageId)}`)
    }

    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(DsnImage)
