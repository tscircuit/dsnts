import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SesWire } from "./SesWire"
import { SesVia } from "./SesVia"

/**
 * SesNet represents a (net ...) definition in SES network_out.
 * Contains wires and vias for a routed net.
 *
 * This differs from DsnNet (used in DSN network section) which contains pin references.
 * SesNet is specifically for routing results in SES files.
 *
 * Format: (net <net_name> (wire ...) ... (via ...) ...)
 * Example: (net VCC (wire (path 2 1772 ...)) (via via0 29574 -111576))
 */
export interface SesNetConstructorParams {
  netName?: string
  wires?: SesWire[]
  vias?: SesVia[]
  otherChildren?: SxClass[]
}

export class SesNet extends SxClass {
  static override token = "net"
  static override parentToken = "network_out"
  token = "net"

  private _netName?: string
  private _wires: SesWire[] = []
  private _vias: SesVia[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: SesNetConstructorParams = {}) {
    super()
    if (params.netName !== undefined) this._netName = params.netName
    if (params.wires !== undefined) this._wires = [...params.wires]
    if (params.vias !== undefined) this._vias = [...params.vias]
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesNet {
    const net = new SesNet()

    // First primitive is the net name
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      net._netName = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesNet.token,
      })

      if (parsed instanceof SxClass) {
        net.consumeChild(parsed)
      }
    }

    return net
  }

  private consumeChild(child: SxClass) {
    if (child instanceof SesWire) {
      this._wires.push(child)
      return
    }
    if (child instanceof SesVia) {
      this._vias.push(child)
      return
    }
    this._otherChildren.push(child)
  }

  get netName(): string | undefined {
    return this._netName
  }

  set netName(value: string | undefined) {
    this._netName = value
  }

  get wires(): SesWire[] {
    return [...this._wires]
  }

  set wires(value: SesWire[]) {
    this._wires = [...value]
  }

  get vias(): SesVia[] {
    return [...this._vias]
  }

  set vias(value: SesVia[]) {
    this._vias = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._wires)
    children.push(...this._vias)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    if (this._netName) {
      lines.push(`  ${this._netName}`)
    }

    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SesNet)
