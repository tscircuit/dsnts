import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnClearance represents a (clearance ...) element in rule definitions.
 * Specifies clearance distance with optional type.
 *
 * Format: (clearance <value> [(type <type_name>)])
 * Example: (clearance 6.000000 (type wire_via))
 */
export interface DsnClearanceConstructorParams {
  value?: number
  type?: string
}

export class DsnClearance extends SxClass {
  static override token = "clearance"
  static override parentToken = "rule"
  token = "clearance"

  private _value?: number
  private _type?: string

  constructor(params: DsnClearanceConstructorParams = {}) {
    super()
    if (params.value !== undefined) this.value = params.value
    if (params.type !== undefined) this.type = params.type
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnClearance {
    const clearance = new DsnClearance()

    // First number is the clearance value
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "number") {
      clearance._value = primitiveSexprs[0]
    }

    // Look for (type <type_name>)
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length >= 2 &&
        primitive[0] === "type" &&
        typeof primitive[1] === "string"
      ) {
        clearance._type = primitive[1]
      }
    }

    return clearance
  }

  get value(): number | undefined {
    return this._value
  }

  set value(value: number | undefined) {
    this._value = value
  }

  get type(): string | undefined {
    return this._type
  }

  set type(value: string | undefined) {
    this._type = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._value !== undefined) {
      parts.push(String(this._value))
    }
    if (this._type) {
      parts.push(`(type ${this._type})`)
    }
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnClearance)
