import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnResolution } from "./DsnResolution"
import { DsnUnit } from "./DsnUnit"
import { DsnWire } from "./DsnWire"

/**
 * DsnWiring represents the (wiring ...) section in DSN/SES files.
 * Contains routing information including wire paths and vias.
 * This is more commonly found in SES (session) files after routing,
 * but can also appear in DSN files.
 *
 * Typical children:
 * - wire: Wire segment definitions with paths
 * - via: Via placements
 * - resolution: Wiring-specific resolution
 * - unit: Wiring-specific units
 */
export interface DsnWiringConstructorParams {
  wires?: DsnWire[]
  vias?: SxClass[]
  resolution?: DsnResolution
  unit?: DsnUnit
  otherChildren?: SxClass[]
}

export class DsnWiring extends SxClass {
  static override token = "wiring"
  static override parentToken = "pcb"
  token = "wiring"

  private _wires: DsnWire[] = []
  private _vias: SxClass[] = []
  private _resolution?: DsnResolution
  private _unit?: DsnUnit
  private _otherChildren: SxClass[] = []

  constructor(params: DsnWiringConstructorParams = {}) {
    super()
    if (params.wires !== undefined) this.wires = params.wires
    if (params.vias !== undefined) this.vias = params.vias
    if (params.resolution !== undefined) this.resolution = params.resolution
    if (params.unit !== undefined) this.unit = params.unit
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnWiring {
    const wiring = new DsnWiring()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnWiring.token,
      })

      if (parsed instanceof SxClass) {
        wiring.consumeChild(parsed)
      }
    }

    return wiring
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnWire) {
      this._wires.push(child)
      return
    }
    if (child instanceof DsnResolution) {
      this._resolution = child
      return
    }
    if (child instanceof DsnUnit) {
      this._unit = child
      return
    }
    // TODO: Route vias to _vias array when DsnVia class exists

    this._otherChildren.push(child)
  }

  get wires(): DsnWire[] {
    return [...this._wires]
  }

  set wires(value: DsnWire[]) {
    this._wires = [...value]
  }

  get vias(): SxClass[] {
    return [...this._vias]
  }

  set vias(value: SxClass[]) {
    this._vias = [...value]
  }

  get resolution(): DsnResolution | undefined {
    return this._resolution
  }

  set resolution(value: DsnResolution | undefined) {
    this._resolution = value
  }

  get unit(): DsnUnit | undefined {
    return this._unit
  }

  set unit(value: DsnUnit | undefined) {
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
    if (this._resolution) children.push(this._resolution)
    if (this._unit) children.push(this._unit)
    children.push(...this._wires)
    children.push(...this._vias)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnWiring)
