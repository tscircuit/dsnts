import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnVia represents a (via ...) element in the structure section.
 * Defines via padstacks available for routing.
 *
 * Format: (via <padstack_name> [<padstack_name> ...])
 * Example: (via "Round1$13.779528")
 */
export interface DsnViaConstructorParams {
  padstackNames?: string[]
}

export class DsnVia extends SxClass {
  static override token = "via"
  token = "via"

  private _padstackNames: string[] = []

  constructor(params: DsnViaConstructorParams = {}) {
    super()
    if (params.padstackNames !== undefined)
      this.padstackNames = params.padstackNames
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnVia {
    const via = new DsnVia()

    // All string primitives are padstack names
    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        via._padstackNames.push(primitive)
      }
    }

    return via
  }

  get padstackNames(): string[] {
    return [...this._padstackNames]
  }

  set padstackNames(value: string[]) {
    this._padstackNames = [...value]
  }

  override getString(): string {
    if (this._padstackNames.length === 0) {
      return `(${this.token})`
    }

    const parts = [`(${this.token}`]
    for (const name of this._padstackNames) {
      parts.push(`  ${JSON.stringify(name)}`)
    }
    parts.push(")")

    return parts.join("\n")
  }
}

SxClass.register(DsnVia)
