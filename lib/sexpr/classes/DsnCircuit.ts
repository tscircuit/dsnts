import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnCircuit represents a (circuit ...) element in class definitions.
 * Contains circuit-specific rules and via usage.
 *
 * Format: (circuit (<setting> <value>) ...)
 * Example: (circuit (use_via "Via[0-1]_800:400_um"))
 */
export interface DsnCircuitConstructorParams {
  settings?: Record<string, string | boolean>
  otherChildren?: SxClass[]
}

export class DsnCircuit extends SxClass {
  static override token = "circuit"
  static override parentToken = "class"
  token = "circuit"

  private _settings: Record<string, string | boolean> = {}
  private _otherChildren: SxClass[] = []

  constructor(params: DsnCircuitConstructorParams = {}) {
    super()
    if (params.settings !== undefined) this.settings = params.settings
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnCircuit {
    const circuit = new DsnCircuit()

    // Parse setting pairs like (use_via "Via[0-1]_800:400_um")
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length >= 2 &&
        typeof primitive[0] === "string"
      ) {
        const key = primitive[0]
        const value = primitive[1]
        if (typeof value === "string" || typeof value === "boolean") {
          circuit._settings[key] = value
        }
      } else if (Array.isArray(primitive)) {
        // Try to parse as SxClass for unrecognized elements
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: "circuit",
        })
        if (parsed instanceof SxClass) {
          circuit._otherChildren.push(parsed)
        }
      }
    }

    return circuit
  }

  get settings(): Record<string, string | boolean> {
    return { ...this._settings }
  }

  set settings(value: Record<string, string | boolean>) {
    this._settings = { ...value }
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  override getString(): string {
    const entries = Object.entries(this._settings)
    const children = this.getChildren()

    if (entries.length === 0 && children.length === 0) {
      return `(${this.token})`
    }

    const lines = [`(${this.token}`]
    for (const [key, value] of entries) {
      const valueStr =
        typeof value === "string" ? JSON.stringify(value) : String(value)
      lines.push(`  (${key} ${valueStr})`)
    }
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")

    return lines.join("\n")
  }
}

SxClass.register(DsnCircuit)
