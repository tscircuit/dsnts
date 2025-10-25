import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnComponent } from "./DsnComponent"
import { DsnResolution } from "./DsnResolution"
import { DsnUnit } from "./DsnUnit"

/**
 * DsnPlacement represents the (placement ...) section in DSN files.
 * Contains component placement information.
 *
 * Typical children:
 * - component: Component definitions with reference designators
 * - place: Specific component placement with position and rotation
 * - resolution: Placement-specific resolution
 * - unit: Placement-specific units
 */
export interface DsnPlacementConstructorParams {
  components?: DsnComponent[]
  resolution?: DsnResolution
  unit?: DsnUnit
  otherChildren?: SxClass[]
}

export class DsnPlacement extends SxClass {
  static override token = "placement"
  static override parentToken = "pcb"
  token = "placement"

  private _components: DsnComponent[] = []
  private _resolution?: DsnResolution
  private _unit?: DsnUnit
  private _otherChildren: SxClass[] = []

  constructor(params: DsnPlacementConstructorParams = {}) {
    super()
    if (params.components !== undefined) this.components = params.components
    if (params.resolution !== undefined) this.resolution = params.resolution
    if (params.unit !== undefined) this.unit = params.unit
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPlacement {
    const placement = new DsnPlacement()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnPlacement.token,
      })

      if (parsed instanceof SxClass) {
        placement.consumeChild(parsed)
      }
    }

    return placement
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnComponent) {
      this._components.push(child)
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

    this._otherChildren.push(child)
  }

  get components(): DsnComponent[] {
    return [...this._components]
  }

  set components(value: DsnComponent[]) {
    this._components = [...value]
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
    children.push(...this._components)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnPlacement)
