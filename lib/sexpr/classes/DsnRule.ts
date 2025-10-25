import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnRule represents a (rule ...) definition.
 * Contains routing rules like width, clearance, etc.
 */
export class DsnRule extends SxClass {
  static override token = "rule"
  static override parentToken = "structure"
  token = "rule"

  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnRule {
    const rule = new DsnRule()
    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnRule.token,
      })
      if (parsed instanceof SxClass) {
        rule._otherChildren.push(parsed)
      }
    }
    return rule
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

SxClass.register(DsnRule)
