import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

/**
 * DsnUnit represents the (unit ...) token in DSN files.
 * Specifies the unit system for the design.
 * Common values: "mil", "mm", "in", "cm"
 * Example: (unit mil)
 */
export class DsnUnit extends SxPrimitiveString {
  static override token = "unit"
  static override parentToken = "pcb"
  token = "unit"

  override getString(): string {
    // Units are typically symbols (no quotes needed)
    return `(unit ${this.value})`
  }
}

SxClass.register(DsnUnit)
