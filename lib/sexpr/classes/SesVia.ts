import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesVia represents a (via ...) definition in SES network_out.
 * Defines a via placement with padstack and coordinates.
 *
 * Format: (via <padstack_id> <x> <y>)
 * Example: (via via0 29574 -111576)
 */
export interface SesViaConstructorParams {
  padstackId?: string
  x?: number
  y?: number
}

export class SesVia extends SxClass {
  static override token = "via"
  static override parentToken = "net"
  token = "via"

  private _padstackId?: string
  private _x?: number
  private _y?: number

  constructor(params: SesViaConstructorParams = {}) {
    super()
    if (params.padstackId !== undefined) this._padstackId = params.padstackId
    if (params.x !== undefined) this._x = params.x
    if (params.y !== undefined) this._y = params.y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesVia {
    const via = new SesVia()

    // First primitive is the padstack ID
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      via._padstackId = primitiveSexprs[0]
    }

    // Parse coordinates
    const numbers = primitiveSexprs.filter(
      (p) => typeof p === "number",
    ) as number[]
    if (numbers.length > 0) via._x = numbers[0]
    if (numbers.length > 1) via._y = numbers[1]

    return via
  }

  get padstackId(): string | undefined {
    return this._padstackId
  }

  set padstackId(value: string | undefined) {
    this._padstackId = value
  }

  get x(): number | undefined {
    return this._x
  }

  set x(value: number | undefined) {
    this._x = value
  }

  get y(): number | undefined {
    return this._y
  }

  set y(value: number | undefined) {
    this._y = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._padstackId) parts.push(this._padstackId)
    if (this._x !== undefined) parts.push(String(this._x))
    if (this._y !== undefined) parts.push(String(this._y))
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(SesVia)
