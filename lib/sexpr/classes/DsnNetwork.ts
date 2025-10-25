import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnClass } from "./DsnClass"
import { DsnNet } from "./DsnNet"

/**
 * DsnNetwork represents the (network ...) section in DSN files.
 * Contains net definitions, net classes, and pin assignments.
 *
 * Typical children:
 * - net: Individual net definitions with pin lists
 * - class: Net class definitions grouping nets with similar rules
 * - pins: Pin definitions
 */
export interface DsnNetworkConstructorParams {
  nets?: DsnNet[]
  classes?: DsnClass[]
  otherChildren?: SxClass[]
}

export class DsnNetwork extends SxClass {
  static override token = "network"
  static override parentToken = "pcb"
  token = "network"

  private _nets: DsnNet[] = []
  private _classes: DsnClass[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnNetworkConstructorParams = {}) {
    super()
    if (params.nets !== undefined) this.nets = params.nets
    if (params.classes !== undefined) this.classes = params.classes
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnNetwork {
    const network = new DsnNetwork()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnNetwork.token,
      })

      if (parsed instanceof SxClass) {
        network.consumeChild(parsed)
      }
    }

    return network
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnNet) {
      this._nets.push(child)
      return
    }
    if (child instanceof DsnClass) {
      this._classes.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get nets(): DsnNet[] {
    return [...this._nets]
  }

  set nets(value: DsnNet[]) {
    this._nets = [...value]
  }

  get classes(): DsnClass[] {
    return [...this._classes]
  }

  set classes(value: DsnClass[]) {
    this._classes = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._nets)
    children.push(...this._classes)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnNetwork)
