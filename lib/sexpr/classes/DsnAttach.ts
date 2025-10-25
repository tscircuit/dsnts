import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnAttach represents an (attach ...) element in padstack definitions.
 * Specifies whether traces can attach to this padstack.
 *
 * Format: (attach on|off)
 * Example: (attach off)
 */
export interface DsnAttachConstructorParams {
  value?: boolean
}

export class DsnAttach extends SxClass {
  static override token = "attach"
  static override parentToken = "padstack"
  token = "attach"

  private _value?: boolean

  constructor(params: DsnAttachConstructorParams = {}) {
    super()
    if (params.value !== undefined) this.value = params.value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnAttach {
    const attach = new DsnAttach()

    // First string is "on" or "off"
    if (primitiveSexprs.length > 0) {
      const value = primitiveSexprs[0]
      if (value === "on") {
        attach._value = true
      } else if (value === "off") {
        attach._value = false
      }
    }

    return attach
  }

  get value(): boolean | undefined {
    return this._value
  }

  set value(value: boolean | undefined) {
    this._value = value
  }

  override getString(): string {
    const valueStr = this._value ? "on" : "off"
    return `(${this.token} ${valueStr})`
  }
}

SxClass.register(DsnAttach)
