import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SesBaseDesign } from "./SesBaseDesign"
import { SesPlacement } from "./SesPlacement"
import { SesWasIs } from "./SesWasIs"
import { SesRoutes } from "./SesRoutes"

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
 */
export interface SpectraSesConstructorParams {
  /** Session/design name */
  sessionName?: string
  /** Base design reference */
  baseDesign?: SesBaseDesign
  /** Placement information */
  placement?: SesPlacement
  /** Was/Is pin mapping changes */
  wasIs?: SesWasIs
  /** Routing results */
  routes?: SesRoutes
  /** Other parsed children not yet implemented */
  otherChildren?: SxClass[]
}

export class SpectraSes extends SxClass {
  static override token = "session"
  token = "session"

  private _sessionName?: string
  private _sxBaseDesign?: SesBaseDesign
  private _sxPlacement?: SesPlacement
  private _sxWasIs?: SesWasIs
  private _sxRoutes?: SesRoutes
  private _otherChildren: SxClass[] = []

  constructor(params: SpectraSesConstructorParams = {}) {
    super()
    if (params.sessionName !== undefined) this._sessionName = params.sessionName
    if (params.baseDesign !== undefined) this._sxBaseDesign = params.baseDesign
    if (params.placement !== undefined) this._sxPlacement = params.placement
    if (params.wasIs !== undefined) this._sxWasIs = params.wasIs
    if (params.routes !== undefined) this._sxRoutes = params.routes
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SpectraSes {
    const ses = new SpectraSes()

    // First primitive is typically the session name (string after "session")
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      ses._sessionName = primitiveSexprs[0]
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
    if (child instanceof SesBaseDesign) {
      this._sxBaseDesign = child
      return
    }
    if (child instanceof SesPlacement) {
      this._sxPlacement = child
      return
    }
    if (child instanceof SesWasIs) {
      this._sxWasIs = child
      return
    }
    if (child instanceof SesRoutes) {
      this._sxRoutes = child
      return
    }
    this._otherChildren.push(child)
  }

  get sessionName(): string | undefined {
    return this._sessionName
  }

  set sessionName(value: string | undefined) {
    this._sessionName = value
  }

  get baseDesign(): SesBaseDesign | undefined {
    return this._sxBaseDesign
  }

  set baseDesign(value: SesBaseDesign | undefined) {
    this._sxBaseDesign = value
  }

  get placement(): SesPlacement | undefined {
    return this._sxPlacement
  }

  set placement(value: SesPlacement | undefined) {
    this._sxPlacement = value
  }

  get wasIs(): SesWasIs | undefined {
    return this._sxWasIs
  }

  set wasIs(value: SesWasIs | undefined) {
    this._sxWasIs = value
  }

  get routes(): SesRoutes | undefined {
    return this._sxRoutes
  }

  set routes(value: SesRoutes | undefined) {
    this._sxRoutes = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []

    if (this._sxBaseDesign) children.push(this._sxBaseDesign)
    if (this._sxPlacement) children.push(this._sxPlacement)
    if (this._sxWasIs) children.push(this._sxWasIs)
    if (this._sxRoutes) children.push(this._sxRoutes)
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
