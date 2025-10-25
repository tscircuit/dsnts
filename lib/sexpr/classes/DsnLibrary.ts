import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnImage } from "./DsnImage"
import { DsnPadstack } from "./DsnPadstack"

/**
 * DsnLibrary represents the (library ...) section in DSN files.
 * Contains component library definitions including images (footprints)
 * and padstacks.
 *
 * Typical children:
 * - image: Footprint/image definitions with outline, pins, keepouts
 * - padstack: Padstack definitions for different pad types
 */
export interface DsnLibraryConstructorParams {
  images?: DsnImage[]
  padstacks?: DsnPadstack[]
  otherChildren?: SxClass[]
}

export class DsnLibrary extends SxClass {
  static override token = "library"
  static override parentToken = "pcb"
  token = "library"

  private _images: DsnImage[] = []
  private _padstacks: DsnPadstack[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnLibraryConstructorParams = {}) {
    super()
    if (params.images !== undefined) this.images = params.images
    if (params.padstacks !== undefined) this.padstacks = params.padstacks
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnLibrary {
    const library = new DsnLibrary()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnLibrary.token,
      })

      if (parsed instanceof SxClass) {
        library.consumeChild(parsed)
      }
    }

    return library
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnImage) {
      this._images.push(child)
      return
    }
    if (child instanceof DsnPadstack) {
      this._padstacks.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get images(): DsnImage[] {
    return [...this._images]
  }

  set images(value: DsnImage[]) {
    this._images = [...value]
  }

  get padstacks(): DsnPadstack[] {
    return [...this._padstacks]
  }

  set padstacks(value: DsnPadstack[]) {
    this._padstacks = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._images)
    children.push(...this._padstacks)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnLibrary)
