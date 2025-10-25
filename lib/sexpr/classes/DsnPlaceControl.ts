import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPlaceControl represents a (place_control ...) element in the placement section.
 * Contains settings for component placement like flip style.
 *
 * Format: (place_control (<setting> <value>) ...)
 * Example: (place_control (flip_style rotate_first))
 */
export interface DsnPlaceControlConstructorParams {
  settings?: Record<string, string | boolean>
}

export class DsnPlaceControl extends SxClass {
  static override token = "place_control"
  static override parentToken = "placement"
  token = "place_control"

  private _settings: Record<string, string | boolean> = {}

  constructor(params: DsnPlaceControlConstructorParams = {}) {
    super()
    if (params.settings !== undefined) this.settings = params.settings
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPlaceControl {
    const control = new DsnPlaceControl()

    // Parse setting pairs like (flip_style rotate_first)
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length >= 2 &&
        typeof primitive[0] === "string"
      ) {
        const key = primitive[0]
        const value = primitive[1]
        if (typeof value === "string" || typeof value === "boolean") {
          control._settings[key] = value
        }
      }
    }

    return control
  }

  get settings(): Record<string, string | boolean> {
    return { ...this._settings }
  }

  set settings(value: Record<string, string | boolean>) {
    this._settings = { ...value }
  }

  override getString(): string {
    const entries = Object.entries(this._settings)
    if (entries.length === 0) {
      return `(${this.token})`
    }

    const lines = [`(${this.token}`]
    for (const [key, value] of entries) {
      lines.push(`  (${key} ${value})`)
    }
    lines.push(")")

    return lines.join("\n")
  }
}

SxClass.register(DsnPlaceControl)
