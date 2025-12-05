import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SesPadstack } from "./SesPadstack"

/**
 * SesLibraryOut represents the (library_out ...) section in SES routes.
 * Contains padstack definitions used for vias in routing.
 *
 * Format: (library_out (padstack ...) ...)
 */
export interface SesLibraryOutConstructorParams {
  padstacks?: SesPadstack[]
  otherChildren?: SxClass[]
}

export class SesLibraryOut extends SxClass {
  static override token = "library_out"
  static override parentToken = "routes"
  token = "library_out"

  private _padstacks: SesPadstack[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: SesLibraryOutConstructorParams = {}) {
    super()
    if (params.padstacks !== undefined) this._padstacks = [...params.padstacks]
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesLibraryOut {
    const libraryOut = new SesLibraryOut()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesLibraryOut.token,
      })

      if (parsed instanceof SxClass) {
        libraryOut.consumeChild(parsed)
      }
    }

    return libraryOut
  }

  private consumeChild(child: SxClass) {
    if (child instanceof SesPadstack) {
      this._padstacks.push(child)
      return
    }
    this._otherChildren.push(child)
  }

  get padstacks(): SesPadstack[] {
    return [...this._padstacks]
  }

  set padstacks(value: SesPadstack[]) {
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
    children.push(...this._padstacks)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(SesLibraryOut)
