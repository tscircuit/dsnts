import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnClearanceClass represents a (clearance_class ...) element.
 * Specifies the clearance class for a boundary or keepout.
 *
 * Format: (clearance_class <class_name>)
 * Example: (clearance_class boundary)
 */
export interface DsnClearanceClassConstructorParams {
  className?: string
}

export class DsnClearanceClass extends SxClass {
  static override token = "clearance_class"
  token = "clearance_class"

  private _className?: string

  constructor(params: DsnClearanceClassConstructorParams = {}) {
    super()
    if (params.className !== undefined) this.className = params.className
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnClearanceClass {
    const clearanceClass = new DsnClearanceClass()

    // First string is the class name
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      clearanceClass._className = primitiveSexprs[0]
    }

    return clearanceClass
  }

  get className(): string | undefined {
    return this._className
  }

  set className(value: string | undefined) {
    this._className = value
  }

  override getString(): string {
    if (!this._className) {
      return `(${this.token})`
    }
    return `(${this.token} ${this._className})`
  }
}

SxClass.register(DsnClearanceClass)
