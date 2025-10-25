import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnOutline represents an (outline ...) in an image.
 */
export class DsnOutline extends SxClass {
  static override token = "outline"
  static override parentToken = "image"
  token = "outline"

  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnOutline {
    const outline = new DsnOutline()
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnOutline.token,
      })
      if (parsed instanceof SxClass) {
        outline._otherChildren.push(parsed)
      }
    }
    return outline
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._otherChildren]
  }
}

SxClass.register(DsnOutline)
