import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesHostCad represents the (host_cad ...) section in SES parser.
 * Contains information about the host CAD tool that generated the file.
 *
 * Format: (host_cad "CAD_NAME")
 */
export class SesHostCad extends SxClass {
  static override token = "host_cad"
  static override parentToken = "parser"
  token = "host_cad"

  private _cadName?: string

  constructor(cadName?: string) {
    super()
    this._cadName = cadName
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesHostCad {
    const hostCad = new SesHostCad()

    // First primitive is the CAD name
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      hostCad._cadName = primitiveSexprs[0]
    }

    return hostCad
  }

  get cadName(): string | undefined {
    return this._cadName
  }

  set cadName(value: string | undefined) {
    this._cadName = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._cadName) {
      return `(${this.token} ${JSON.stringify(this._cadName)})`
    }
    return `(${this.token})`
  }
}

SxClass.register(SesHostCad)
