import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesWasIs represents the (was_is ...) section in SES files.
 * Contains pin mapping changes from original design.
 * Format: (was_is (pins ...) ...)
 */
export interface SesWasIsConstructorParams {
  otherChildren?: SxClass[]
}

export class SesWasIs extends SxClass {
  static override token = "was_is"
  static override parentToken = "session"
  token = "was_is"

  private _otherChildren: SxClass[] = []

  constructor(params: SesWasIsConstructorParams = {}) {
    super()
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesWasIs {
    const wasIs = new SesWasIs()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesWasIs.token,
      })

      if (parsed instanceof SxClass) {
        wasIs._otherChildren.push(parsed)
      }
    }

    return wasIs
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

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return "(was_is\n)"
    }

    const lines = [`(${this.token}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SesWasIs)
