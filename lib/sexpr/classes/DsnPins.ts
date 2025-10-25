import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPins represents a (pins ...) element in net definitions.
 * Lists all component pins connected to a net.
 *
 * Format: (pins <pin_ref> [<pin_ref> ...])
 * Pin ref format: "<component>"-"<pin>"
 * Example: (pins "J3"-"D+" "J1"-"D+")
 */
export interface DsnPinsConstructorParams {
  pinRefs?: string[]
}

export class DsnPins extends SxClass {
  static override token = "pins"
  static override parentToken = "net"
  token = "pins"

  private _pinRefs: string[] = []

  constructor(params: DsnPinsConstructorParams = {}) {
    super()
    if (params.pinRefs !== undefined) this.pinRefs = params.pinRefs
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPins {
    const pins = new DsnPins()

    // All string primitives are pin references
    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        pins._pinRefs.push(primitive)
      }
    }

    return pins
  }

  get pinRefs(): string[] {
    return [...this._pinRefs]
  }

  set pinRefs(value: string[]) {
    this._pinRefs = [...value]
  }

  override getString(): string {
    if (this._pinRefs.length === 0) {
      return `(${this.token})`
    }

    const parts = [`(${this.token}`]
    for (const ref of this._pinRefs) {
      parts.push(JSON.stringify(ref))
    }
    parts.push(")")

    return parts.join(" ")
  }
}

SxClass.register(DsnPins)
