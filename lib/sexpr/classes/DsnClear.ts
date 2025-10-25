import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnClear represents a (clear ...) element in rule definitions.
 * Similar to clearance, specifies clear distance with optional type.
 *
 * Format: (clear <value> [(type <type_name>)])
 * Example: (clear 0.9184 (type default_smd))
 */
export interface DsnClearConstructorParams {
  value?: number
  type?: string
}

export class DsnClear extends SxClass {
  static override token = "clear"
  static override parentToken = "rule"
  token = "clear"

  private _value?: number
  private _type?: string

  constructor(params: DsnClearConstructorParams = {}) {
    super()
    if (params.value !== undefined) this.value = params.value
    if (params.type !== undefined) this.type = params.type
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnClear {
    const clear = new DsnClear()

    // First number is the clear value
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "number") {
      clear._value = primitiveSexprs[0]
    }

    // Look for (type <type_name>)
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length >= 2 &&
        primitive[0] === "type" &&
        typeof primitive[1] === "string"
      ) {
        clear._type = primitive[1]
      }
    }

    return clear
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

SxClass.register(DsnClear)
