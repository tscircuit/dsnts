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
    const strings = primitiveSexprs.filter(
      (p) => typeof p === "string",
    ) as string[]
    const numbers = primitiveSexprs.filter(
      (p) => typeof p === "number",
    ) as number[]
    if (strings[0]) pin._padstackId = strings[0]
    if (strings[1]) pin._pinId = strings[1]
    if (numbers[0] !== undefined) pin._x = numbers[0]
    if (numbers[1] !== undefined) pin._y = numbers[1]
    if (numbers[2] !== undefined) pin._rotation = numbers[2]
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
