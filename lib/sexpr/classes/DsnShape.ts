import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnShape represents a (shape ...) definition in a padstack.
 */
export class DsnShape extends SxClass {
  static override token = "shape"
  static override parentToken = "padstack"
  token = "shape"

  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnShape {
    const shape = new DsnShape()
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnShape.token,
      })
      if (parsed instanceof SxClass) {
        shape._otherChildren.push(parsed)
      }
    }
    return shape
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

SxClass.register(DsnShape)
