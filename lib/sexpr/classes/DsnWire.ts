import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnWire represents a (wire ...) definition in the wiring section.
 * Defines a wire/trace segment with its path and layer.
 *
 * Format: (wire <path_descriptor> <net_id> <width> <layer>)
 * Example: (wire (path signal 100 200 300 400) "NET_1" 10 "TOP")
 *
 * Children can include:
 * - path: Wire path coordinates
 * - type: Wire type
 * - property: Wire properties
 */
export interface DsnWireConstructorParams {
  netId?: string
  width?: number
  layer?: string
  paths?: SxClass[]
  otherChildren?: SxClass[]
}

export class DsnWire extends SxClass {
  static override token = "wire"
  static override parentToken = "wiring"
  token = "wire"

  private _netId?: string
  private _width?: number
  private _layer?: string
  private _paths: SxClass[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnWireConstructorParams = {}) {
    super()
    if (params.netId !== undefined) this.netId = params.netId
    if (params.width !== undefined) this.width = params.width
    if (params.layer !== undefined) this.layer = params.layer
    if (params.paths !== undefined) this.paths = params.paths
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnWire {
    const wire = new DsnWire()

    // Parse primitives - can include strings, numbers, and child elements
    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        // Could be net ID or layer
        if (!wire._netId) {
          wire._netId = primitive
        } else if (!wire._layer) {
          wire._layer = primitive
        }
      } else if (typeof primitive === "number") {
        // Wire width
        if (!wire._width) {
          wire._width = primitive
        }
      } else if (Array.isArray(primitive) && primitive.length > 0) {
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: DsnWire.token,
        })

        if (parsed instanceof SxClass) {
          // TODO: Route to _paths array when path class exists
          wire._otherChildren.push(parsed)
        }
      }
    }

    return wire
  }

  get netId(): string | undefined {
    return this._netId
  }

  set netId(value: string | undefined) {
    this._netId = value
  }

  get width(): number | undefined {
    return this._width
  }

  set width(value: number | undefined) {
    this._width = value
  }

  get layer(): string | undefined {
    return this._layer
  }

  set layer(value: string | undefined) {
    this._layer = value
  }

  get paths(): SxClass[] {
    return [...this._paths]
  }

  set paths(value: SxClass[]) {
    this._paths = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._paths)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    // Add children first (paths typically come first)
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    // Add primitives
    if (this._netId) {
      lines.push(`  ${JSON.stringify(this._netId)}`)
    }
    if (this._width !== undefined) {
      lines.push(`  ${this._width}`)
    }
    if (this._layer) {
      lines.push(`  ${JSON.stringify(this._layer)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(DsnWire)
