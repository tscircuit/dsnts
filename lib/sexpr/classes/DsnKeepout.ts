import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnKeepout represents a (keepout ...) definition.
 */
export class DsnKeepout extends SxClass {
  static override token = "keepout"
  static override parentToken = "structure"
  token = "keepout"

  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnKeepout {
    const keepout = new DsnKeepout()
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnKeepout.token,
      })
      if (parsed instanceof SxClass) {
        keepout._otherChildren.push(parsed)
      }
    }
    return keepout
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

SxClass.register(DsnKeepout)
