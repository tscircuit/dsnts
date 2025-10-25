import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnGrid represents a (grid ...) element in the structure section.
 * Defines grid spacing for routing, vias, or placement.
 *
 * Format: (grid <type> <spacing>)
 * Example: (grid via 0.25)
 */
export interface DsnGridConstructorParams {
  gridType?: string
  spacing?: number
}

export class DsnGrid extends SxClass {
  static override token = "grid"
  static override parentToken = "structure"
  token = "grid"

  private _gridType?: string
  private _spacing?: number

  constructor(params: DsnGridConstructorParams = {}) {
    super()
    if (params.gridType !== undefined) this.gridType = params.gridType
    if (params.spacing !== undefined) this.spacing = params.spacing
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnGrid {
    const grid = new DsnGrid()

    // First string is the grid type
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      grid._gridType = primitiveSexprs[0]
    }

    // Second element is the spacing (number)
    if (primitiveSexprs.length > 1 && typeof primitiveSexprs[1] === "number") {
      grid._spacing = primitiveSexprs[1]
    }

    return grid
  }

  get gridType(): string | undefined {
    return this._gridType
  }

  set gridType(value: string | undefined) {
    this._gridType = value
  }

  get spacing(): number | undefined {
    return this._spacing
  }

  set spacing(value: number | undefined) {
    this._spacing = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._gridType) {
      parts.push(this._gridType)
    }
    if (this._spacing !== undefined) {
      parts.push(String(this._spacing))
    }
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnGrid)
