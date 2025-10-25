import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnPolygon } from "./DsnPolygon"

/**
 * DsnPlane represents a (plane ...) element in the wiring section.
 * Defines copper plane areas for power/ground nets.
 *
 * Format: (plane <net_name> (polygon ...))
 * Example: (plane AGND (polygon Route2 0 214249 -158877 ...))
 */
export interface DsnPlaneConstructorParams {
  netName?: string
  polygon?: DsnPolygon
}

export class DsnPlane extends SxClass {
  static override token = "plane"
  static override parentToken = "wiring"
  token = "plane"

  private _netName?: string
  private _polygon?: DsnPolygon

  constructor(params: DsnPlaneConstructorParams = {}) {
    super()
    if (params.netName !== undefined) this.netName = params.netName
    if (params.polygon !== undefined) this.polygon = params.polygon
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPlane {
    const plane = new DsnPlane()

    // First string is the net name
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      plane._netName = primitiveSexprs[0]
    }

    // Parse polygon child
    for (const primitive of primitiveSexprs) {
      if (
        Array.isArray(primitive) &&
        primitive.length > 0 &&
        primitive[0] === "polygon"
      ) {
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: "plane",
        })
        if (parsed instanceof DsnPolygon) {
          plane._polygon = parsed
        }
      }
    }

    return plane
  }

  get netName(): string | undefined {
    return this._netName
  }

  set netName(value: string | undefined) {
    this._netName = value
  }

  get polygon(): DsnPolygon | undefined {
    return this._polygon
  }

  set polygon(value: DsnPolygon | undefined) {
    this._polygon = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._polygon) children.push(this._polygon)
    return children
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._netName) {
      parts.push(this._netName)
    }
    if (this._polygon) {
      parts.push(this._polygon.getString())
    }
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnPlane)

// Also register with structure parent (some DSN files have planes in structure)
SxClass.register(
  class extends DsnPlane {
    static override parentToken = "structure"
  },
)
