import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPin represents a (pin ...) definition in an image.
 * Format: (pin <padstack_id> <pin_id> <x> <y> <rotation>)
 */
export interface DsnPinConstructorParams {
  padstackId?: string
  pinId?: string
  x?: number
  y?: number
  rotation?: number
}

export class DsnPin extends SxClass {
  static override token = "pin"
  static override parentToken = "image"
  token = "pin"

  private _padstackId?: string
  private _pinId?: string
  private _x?: number
  private _y?: number
  private _rotation?: number

  constructor(params: DsnPinConstructorParams = {}) {
    super()
    if (params.padstackId !== undefined) this.padstackId = params.padstackId
    if (params.pinId !== undefined) this.pinId = params.pinId
    if (params.x !== undefined) this.x = params.x
    if (params.y !== undefined) this.y = params.y
    if (params.rotation !== undefined) this.rotation = params.rotation
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPin {
    const pin = new DsnPin()
    // DSN format: (pin <padstack_id> [(rotate <angle>)] <pin_id> <x> <y> [rotation])
    // Parse positionally - pin_id can be a number or string
    // Filter to only strings and numbers (skip nested arrays like (rotate ...))
    const primitives = primitiveSexprs.filter(
      (p) => typeof p === "string" || typeof p === "number",
    ) as (string | number)[]

    // Check for inline (rotate ...) expression and extract rotation from it
    const rotateExpr = primitiveSexprs.find(
      (p) => Array.isArray(p) && p[0] === "rotate",
    ) as PrimitiveSExpr[] | undefined
    if (rotateExpr && typeof rotateExpr[1] === "number") {
      pin._rotation = rotateExpr[1]
    }

    if (primitives[0] !== undefined) pin._padstackId = String(primitives[0])
    if (primitives[1] !== undefined) pin._pinId = String(primitives[1])
    if (primitives[2] !== undefined && typeof primitives[2] === "number")
      pin._x = primitives[2]
    if (primitives[3] !== undefined && typeof primitives[3] === "number")
      pin._y = primitives[3]
    // Only set rotation from primitives if not already set from (rotate ...) expression
    if (
      pin._rotation === undefined &&
      primitives[4] !== undefined &&
      typeof primitives[4] === "number"
    )
      pin._rotation = primitives[4]
    return pin
  }

  get padstackId(): string | undefined {
    return this._padstackId
  }

  set padstackId(value: string | undefined) {
    this._padstackId = value
  }

  get pinId(): string | undefined {
    return this._pinId
  }

  set pinId(value: string | undefined) {
    this._pinId = value
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

  get rotation(): number | undefined {
    return this._rotation
  }

  set rotation(value: number | undefined) {
    this._rotation = value
  }

  override getString(): string {
    const parts = [this.token]
    if (this._padstackId) parts.push(this._padstackId)
    if (this._pinId) parts.push(this._pinId)
    if (this._x !== undefined) parts.push(String(this._x))
    if (this._y !== undefined) parts.push(String(this._y))
    if (this._rotation !== undefined) parts.push(String(this._rotation))
    return `(${parts.join(" ")})`
  }
}

SxClass.register(DsnPin)
