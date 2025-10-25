import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnType represents a (type ...) element.
 * Used in various contexts to specify a type value.
 *
 * Format: (type <type_value>)
 * Example: (type protect)
 * Example: (type signal)
 */
export interface DsnTypeConstructorParams {
  typeValue?: string
}

export class DsnType extends SxClass {
  static override token = "type"
  token = "type"

  private _typeValue?: string

  constructor(params: DsnTypeConstructorParams = {}) {
    super()
    if (params.typeValue !== undefined) this.typeValue = params.typeValue
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnType {
    const type = new DsnType()

    // First string is the type value
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      type._typeValue = primitiveSexprs[0]
    }

    return type
  }

  get typeValue(): string | undefined {
    return this._typeValue
  }

  set typeValue(value: string | undefined) {
    this._typeValue = value
  }

  override getString(): string {
    if (!this._typeValue) {
      return `(${this.token})`
    }
    return `(${this.token} ${this._typeValue})`
  }
}

// Register for various parent contexts
SxClass.register(DsnType)

// Register with specific parent tokens as needed
const parentTokens = ["wire", "layer", "via"]
for (const parentToken of parentTokens) {
  SxClass.register(
    class extends DsnType {
      static override parentToken = parentToken
    },
  )
}
