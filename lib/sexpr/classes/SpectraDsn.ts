import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnParser } from "./DsnParser"
import { DsnResolution } from "./DsnResolution"
import { DsnUnit } from "./DsnUnit"
import { DsnStructure } from "./DsnStructure"
import { DsnPlacement } from "./DsnPlacement"
import { DsnLibrary } from "./DsnLibrary"
import { DsnNetwork } from "./DsnNetwork"
import { DsnWiring } from "./DsnWiring"

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
  parser?: string | DsnParser
  /** Board design name */
  designName?: string
  /** Resolution unit and value */
  resolution?: DsnResolution
  /** Unit type (mil, mm, etc.) */
  unit?: string | DsnUnit
  /** Structure section (boundary, layers, rules) */
  structure?: DsnStructure
  /** Placement section (component placements) */
  placement?: DsnPlacement
  /** Library section (padstacks, images) */
  library?: DsnLibrary
  /** Network section (nets, classes) */
  network?: DsnNetwork
  /** Wiring section (routes, vias) */
  wiring?: DsnWiring
  /** Other parsed children not yet implemented */
  otherChildren?: SxClass[]
}

export class SpectraDsn extends SxClass {
  static override token = "pcb"
  token = "pcb"

  private _designName?: string
  private _sxParser?: DsnParser
  private _sxResolution?: DsnResolution
  private _sxUnit?: DsnUnit
  private _sxStructure?: DsnStructure
  private _sxPlacement?: DsnPlacement
  private _sxLibrary?: DsnLibrary
  private _sxNetwork?: DsnNetwork
  private _sxWiring?: DsnWiring
  private _otherChildren: SxClass[] = []

  constructor(params: SpectraDsnConstructorParams = {}) {
    super()
    if (params.parser !== undefined) this.parser = params.parser
    if (params.designName !== undefined) this.designName = params.designName
    if (params.resolution !== undefined) this.resolution = params.resolution
    if (params.unit !== undefined) this.unit = params.unit
    if (params.structure !== undefined) this.structure = params.structure
    if (params.placement !== undefined) this.placement = params.placement
    if (params.library !== undefined) this.library = params.library
    if (params.network !== undefined) this.network = params.network
    if (params.wiring !== undefined) this.wiring = params.wiring
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SpectraDsn {
    const dsn = new SpectraDsn()

    // First primitive is typically the design name (string after "pcb")
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
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
        parentToken: SpectraDsn.token,
      })

      if (parsed instanceof SxClass) {
        dsn.consumeChild(parsed)
      }
    }

    return dsn
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnParser) {
      this._sxParser = child
      return
    }
    if (child instanceof DsnResolution) {
      this._sxResolution = child
      return
    }
    if (child instanceof DsnUnit) {
      this._sxUnit = child
      return
    }
    if (child instanceof DsnStructure) {
      this._sxStructure = child
      return
    }
    if (child instanceof DsnPlacement) {
      this._sxPlacement = child
      return
    }
    if (child instanceof DsnLibrary) {
      this._sxLibrary = child
      return
    }
    if (child instanceof DsnNetwork) {
      this._sxNetwork = child
      return
    }
    if (child instanceof DsnWiring) {
      this._sxWiring = child
      return
    }

    // Store unrecognized children
    this._otherChildren.push(child)
  }

  get designName(): string | undefined {
    return this._designName
  }

  set designName(value: string | undefined) {
    this._designName = value
  }

  get parser(): string | undefined {
    return this._sxParser?.value
  }

  set parser(value: string | DsnParser | undefined) {
    if (value === undefined) {
      this._sxParser = undefined
    } else if (typeof value === "string") {
      this._sxParser = new DsnParser(value)
    } else {
      this._sxParser = value
    }
  }

  get resolution(): DsnResolution | undefined {
    return this._sxResolution
  }

  set resolution(value: DsnResolution | undefined) {
    this._sxResolution = value
  }

  get unit(): string | undefined {
    return this._sxUnit?.value
  }

  set unit(value: string | DsnUnit | undefined) {
    if (value === undefined) {
      this._sxUnit = undefined
    } else if (typeof value === "string") {
      this._sxUnit = new DsnUnit(value)
    } else {
      this._sxUnit = value
    }
  }

  get structure(): DsnStructure | undefined {
    return this._sxStructure
  }

  set structure(value: DsnStructure | undefined) {
    this._sxStructure = value
  }

  get placement(): DsnPlacement | undefined {
    return this._sxPlacement
  }

  set placement(value: DsnPlacement | undefined) {
    this._sxPlacement = value
  }

  get library(): DsnLibrary | undefined {
    return this._sxLibrary
  }

  set library(value: DsnLibrary | undefined) {
    this._sxLibrary = value
  }

  get network(): DsnNetwork | undefined {
    return this._sxNetwork
  }

  set network(value: DsnNetwork | undefined) {
    this._sxNetwork = value
  }

  get wiring(): DsnWiring | undefined {
    return this._sxWiring
  }

  set wiring(value: DsnWiring | undefined) {
    this._sxWiring = value
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

    // Add DSN-specific children in typical DSN file order
    if (this._sxParser) children.push(this._sxParser)
    if (this._sxResolution) children.push(this._sxResolution)
    if (this._sxUnit) children.push(this._sxUnit)
    if (this._sxStructure) children.push(this._sxStructure)
    if (this._sxPlacement) children.push(this._sxPlacement)
    if (this._sxLibrary) children.push(this._sxLibrary)
    if (this._sxNetwork) children.push(this._sxNetwork)
    if (this._sxWiring) children.push(this._sxWiring)

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
