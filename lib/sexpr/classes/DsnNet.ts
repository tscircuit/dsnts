import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnNet represents a (net ...) definition in the network section.
 * Defines a single net with its pins and properties.
 *
 * Format: (net <net_name> <pin_ref> <pin_ref> ...)
 * Example: (net "GND" "U1-1" "C1-2" "R1-1")
 *
 * Children can include:
 * - pins: Pin reference strings
 * - property: Net properties
 * - type: Net type
 */
export interface DsnNetConstructorParams {
  netName?: string
  pins?: string[]
  otherChildren?: SxClass[]
}

export class DsnNet extends SxClass {
  static override token = "net"
  static override parentToken = "network"
  token = "net"

  private _netName?: string
  private _pins: string[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnNetConstructorParams = {}) {
    super()
    if (params.netName !== undefined) this.netName = params.netName
    if (params.pins !== undefined) this.pins = params.pins
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnNet {
    const net = new DsnNet()

    // First primitive is the net name
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      net.netName = primitiveSexprs[0]
    }

    // Remaining primitives can be pin strings or child elements
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]

      if (typeof primitive === "string") {
        // Pin reference string
        net._pins.push(primitive)
      } else if (Array.isArray(primitive) && primitive.length > 0) {
        // Child element
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: DsnNet.token,
        })

        if (parsed instanceof SxClass) {
          net._otherChildren.push(parsed)
        }
      }
    }

    return net
  }

  get netName(): string | undefined {
    return this._netName
  }

  set netName(value: string | undefined) {
    this._netName = value
  }

  get pins(): string[] {
    return [...this._pins]
  }

  set pins(value: string[]) {
    this._pins = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    if (this._netName) {
      lines.push(`  ${JSON.stringify(this._netName)}`)
    }

    // Add pin references
    for (const pin of this._pins) {
      lines.push(`  ${JSON.stringify(pin)}`)
    }

    // Add child elements
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

// Register for both network and wire parents
SxClass.register(DsnNet)
// Also register with wire parent token
SxClass.register(
  class extends DsnNet {
    static override parentToken = "wire"
  },
)
