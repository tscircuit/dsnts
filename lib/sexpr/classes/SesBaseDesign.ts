import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesBaseDesign represents the (base_design ...) token in SES files.
 * References the original DSN file that was routed.
 * Format: (base_design <design_name>)
 * Example: (base_design "Issue313-FastTest.dsn")
 */
export class SesBaseDesign extends SxClass {
  static override token = "base_design"
  static override parentToken = "session"
  token = "base_design"

  private _designName?: string

  constructor(designName?: string) {
    super()
    if (designName !== undefined) this._designName = designName
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesBaseDesign {
    const designName =
      typeof primitiveSexprs[0] === "string" ? primitiveSexprs[0] : undefined

    return new SesBaseDesign(designName)
  }

  get designName(): string | undefined {
    return this._designName
  }

  set designName(value: string | undefined) {
    this._designName = value
  }

  override getString(): string {
    if (this._designName) {
      return `(base_design ${JSON.stringify(this._designName)})`
    }
    return "(base_design)"
  }
}

SxClass.register(SesBaseDesign)
