import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SpectraDsn represents the root of a Specctra DSN (Design) file.
 * DSN files start with (pcb ...) and contain board structure, placement,
 * library definitions, networks, and optionally wiring information.
 *
 * Based on Specctra DSN specification, a typical structure includes:
 * - parser: Parser information
 * - resolution: Unit resolution (mil/mm)
 * - unit: Unit type
 * - structure: Board boundary, layers, rules
 * - placement: Component placement data
 * - library: Padstacks and images (footprints)
 * - network: Net definitions and classes
 * - wiring: Routing data (optional, more common in SES)
 */
export interface SpectraDsnConstructorParams {
  /** Parser name/version string */
  parser?: string
  /** Board design name */
  designName?: string
  /** Resolution unit and value */
  resolution?: { unit: string; value: number }
  /** Unit type (mil, mm, etc.) */
  unit?: string
  /** Other parsed children not yet implemented */
  otherChildren?: SxClass[]
}

export class SpectraDsn extends SxClass {
  static override token = "pcb"
  token = "pcb"

  private _designName?: string
  private _parser?: string
  private _resolution?: { unit: string; value: number }
  private _unit?: string
  private _otherChildren: SxClass[] = []

  constructor(params: SpectraDsnConstructorParams = {}) {
    super()
    if (params.parser !== undefined) this.parser = params.parser
    if (params.designName !== undefined) this.designName = params.designName
    if (params.resolution !== undefined) this.resolution = params.resolution
    if (params.unit !== undefined) this.unit = params.unit
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SpectraDsn {
    const dsn = new SpectraDsn()

    // First primitive is typically the design name (string after "pcb")
    if (
      primitiveSexprs.length > 0 &&
      typeof primitiveSexprs[0] === "string"
    ) {
      dsn.designName = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]

      if (!Array.isArray(primitive) || primitive.length === 0) {
        // Skip non-array primitives (shouldn't happen but handle gracefully)
        continue
      }

      // Try to parse as SxClass
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (parsed instanceof SxClass) {
        dsn.consumeChild(parsed)
      }
    }

    return dsn
  }

  private consumeChild(child: SxClass) {
    // TODO: As we implement DSN-specific classes (Parser, Resolution, Structure, etc.),
    // add instanceof checks here similar to KicadPcb.consumeChild()
    //
    // For now, store all children as otherChildren
    this._otherChildren.push(child)
  }

  get designName(): string | undefined {
    return this._designName
  }

  set designName(value: string | undefined) {
    this._designName = value
  }

  get parser(): string | undefined {
    return this._parser
  }

  set parser(value: string | undefined) {
    this._parser = value
  }

  get resolution(): { unit: string; value: number } | undefined {
    return this._resolution
  }

  set resolution(value: { unit: string; value: number } | undefined) {
    this._resolution = value
  }

  get unit(): string | undefined {
    return this._unit
  }

  set unit(value: string | undefined) {
    this._unit = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []

    // Design name is output as a string primitive, not an SxClass
    // It will be handled specially in getString()

    // TODO: Add specific DSN children here as they're implemented
    // if (this._sxParser) children.push(this._sxParser)
    // if (this._sxResolution) children.push(this._sxResolution)
    // if (this._sxStructure) children.push(this._sxStructure)
    // etc.

    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    // Add design name as first value if present
    if (this._designName) {
      lines.push(`  ${JSON.stringify(this._designName)}`)
    }

    // Add children
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SpectraDsn)
