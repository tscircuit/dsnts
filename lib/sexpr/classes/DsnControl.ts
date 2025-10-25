import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnControl represents a (control ...) element in the structure section.
 * Contains control settings for routing and placement.
 *
 * Format: (control (<setting> <value>) ...)
 * Example: (control (via_at_smd on))
 */
export interface DsnControlConstructorParams {
  settings?: Record<string, string | boolean>
}

export class DsnControl extends SxClass {
  static override token = "control"
  token = "control"

  private _settings: Record<string, string | boolean> = {}

  constructor(params: DsnControlConstructorParams = {}) {
    super()
    if (params.settings !== undefined) this.settings = params.settings
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnControl {
    const control = new DsnControl()

    // Parse setting pairs like (via_at_smd on)
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length >= 2 &&
        typeof primitive[0] === "string"
      ) {
        const key = primitive[0]
        const value = primitive[1]
        // Convert "on"/"off" to boolean
        if (value === "on") {
          control._settings[key] = true
        } else if (value === "off") {
          control._settings[key] = false
        } else if (typeof value === "string" || typeof value === "boolean") {
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
      const valueStr =
        typeof value === "boolean" ? (value ? "on" : "off") : value
      lines.push(`  (${key} ${valueStr})`)
    }
    lines.push(")")

    return lines.join("\n")
  }
}

SxClass.register(DsnControl)
