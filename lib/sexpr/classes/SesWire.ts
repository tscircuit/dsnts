import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SesPath } from "./SesPath"

/**
 * SesWire represents a (wire ...) definition in SES network_out.
 * Contains path information for routed traces.
 *
 * Format: (wire (path ...))
 * Example: (wire (path 2 1772 45016 -138866 19999 -113849))
 */
export interface SesWireConstructorParams {
  path?: SesPath
  otherChildren?: SxClass[]
}

export class SesWire extends SxClass {
  static override token = "wire"
  static override parentToken = "net"
  token = "wire"

  private _sxPath?: SesPath
  private _otherChildren: SxClass[] = []

  constructor(params: SesWireConstructorParams = {}) {
    super()
    if (params.path !== undefined) this._sxPath = params.path
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesWire {
    const wire = new SesWire()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesWire.token,
      })

      if (parsed instanceof SxClass) {
        wire.consumeChild(parsed)
      }
    }

    return wire
  }

  private consumeChild(child: SxClass) {
    if (child instanceof SesPath) {
      this._sxPath = child
      return
    }
    this._otherChildren.push(child)
  }

  get path(): SesPath | undefined {
    return this._sxPath
  }

  set path(value: SesPath | undefined) {
    this._sxPath = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPath) children.push(this._sxPath)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return "(wire\n)"
    }

    const lines = [`(${this.token}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SesWire)
