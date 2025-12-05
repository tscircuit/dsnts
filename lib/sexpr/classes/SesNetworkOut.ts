import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SesNet } from "./SesNet"

/**
 * SesNetworkOut represents the (network_out ...) section in SES routes.
 * Contains net definitions with their routed wires and vias.
 *
 * Format: (network_out (net ...) ...)
 */
export interface SesNetworkOutConstructorParams {
  nets?: SesNet[]
  otherChildren?: SxClass[]
}

export class SesNetworkOut extends SxClass {
  static override token = "network_out"
  static override parentToken = "routes"
  token = "network_out"

  private _nets: SesNet[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: SesNetworkOutConstructorParams = {}) {
    super()
    if (params.nets !== undefined) this._nets = [...params.nets]
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesNetworkOut {
    const networkOut = new SesNetworkOut()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesNetworkOut.token,
      })

      if (parsed instanceof SxClass) {
        networkOut.consumeChild(parsed)
      }
    }

    return networkOut
  }

  private consumeChild(child: SxClass) {
    if (child instanceof SesNet) {
      this._nets.push(child)
      return
    }
    this._otherChildren.push(child)
  }

  get nets(): SesNet[] {
    return [...this._nets]
  }

  set nets(value: SesNet[]) {
    this._nets = [...value]
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
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(SesNetworkOut)
