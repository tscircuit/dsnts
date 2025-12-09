import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesHostVersion represents the (host_version ...) section in SES parser.
 * Contains the version of the host CAD tool.
 *
 * Format: (host_version "VERSION_STRING") or (host_version )
 */
export class SesHostVersion extends SxClass {
  static override token = "host_version"
  static override parentToken = "parser"
  token = "host_version"

  private _version?: string

  constructor(version?: string) {
    super()
    this._version = version
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesHostVersion {
    const hostVersion = new SesHostVersion()

    // First primitive is the version string (may be empty)
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      hostVersion._version = primitiveSexprs[0]
    }

    return hostVersion
  }

  get version(): string | undefined {
    return this._version
  }

  set version(value: string | undefined) {
    this._version = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._version) {
      return `(${this.token} ${JSON.stringify(this._version)})`
    }
    return `(${this.token} )`
  }
}

SxClass.register(SesHostVersion)
