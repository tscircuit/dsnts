import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SpectraSes represents the root of a Specctra SES (Session) file.
 * SES files start with (session ...) and contain routing results
 * from an autorouter.
 *
 * Based on Specctra DSN specification, a typical structure includes:
 * - base_design: Reference to the original DSN file
 * - placement: Component placement results
 * - was_is: Design changes/modifications
 * - routes: Wire routes and via placements
 * - library_out: Modified library elements
 * - network_out: Modified network data
 */
export interface SpectraSesConstructorParams {
  /** Session/design name */
  sessionName?: string
  /** Base design file reference */
  baseDesign?: string
  /** Other parsed children not yet implemented */
  otherChildren?: SxClass[]
}

export class SpectraSes extends SxClass {
  static override token = "session"
  token = "session"

  private _sessionName?: string
  private _baseDesign?: string
  private _otherChildren: SxClass[] = []

  constructor(params: SpectraSesConstructorParams = {}) {
    super()
    if (params.sessionName !== undefined) this.sessionName = params.sessionName
    if (params.baseDesign !== undefined) this.baseDesign = params.baseDesign
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SpectraSes {
    const ses = new SpectraSes()

    // First primitive is typically the session name (string after "session")
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      ses.sessionName = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]

      if (!Array.isArray(primitive) || primitive.length === 0) {
        // Skip non-array primitives
        continue
      }

      // Try to parse as SxClass
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SpectraSes.token,
      })

      if (parsed instanceof SxClass) {
        ses.consumeChild(parsed)
      }
    }

    return ses
  }

  private consumeChild(child: SxClass) {
    // TODO: As we implement SES-specific classes (BaseDesign, Routes, etc.),
    // add instanceof checks here
    //
    // For now, store all children as otherChildren
    this._otherChildren.push(child)
  }

  get sessionName(): string | undefined {
    return this._sessionName
  }

  set sessionName(value: string | undefined) {
    this._sessionName = value
  }

  get baseDesign(): string | undefined {
    return this._baseDesign
  }

  set baseDesign(value: string | undefined) {
    this._baseDesign = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []

    // Session name is output as a string primitive, not an SxClass
    // It will be handled specially in getString()

    // TODO: Add specific SES children here as they're implemented
    // if (this._sxBaseDesign) children.push(this._sxBaseDesign)
    // if (this._sxRoutes) children.push(this._sxRoutes)
    // etc.

    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    // Add session name as first value if present
    if (this._sessionName) {
      lines.push(`  ${JSON.stringify(this._sessionName)}`)
    }

    // Add children
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SpectraSes)
