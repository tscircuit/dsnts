import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnResolution represents the (resolution ...) token in DSN files.
 * Defines the resolution unit and value for the design.
 * Format: (resolution <unit> <value>)
 * Example: (resolution mil 10) means 1 design unit = 10 mils
 * Example: (resolution mm 100000) means 1 design unit = 0.01 mm
 */
export class DsnResolution extends SxClass {
  static override token = "resolution"
  static override parentToken = "pcb"
  token = "resolution"

  private _unit: string
  private _value: number

  constructor(unit: string, value: number) {
    super()
    this._unit = unit
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnResolution {
    // Expected format: [unit_string, value_number]
    const unit =
      typeof primitiveSexprs[0] === "string" ? primitiveSexprs[0] : "mil"
    const value =
      typeof primitiveSexprs[1] === "number" ? primitiveSexprs[1] : 10

    return new DsnResolution(unit, value)
  }

  get unit(): string {
    return this._unit
  }

  set unit(value: string) {
    this._unit = value
  }

  get value(): number {
    return this._value
  }

  set value(val: number) {
    this._value = val
  }

  override getString(): string {
    return `(resolution ${this._unit} ${this._value})`
  }
}

SxClass.register(DsnResolution)
