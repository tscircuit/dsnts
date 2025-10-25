import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnRect represents a (rect ...) shape descriptor.
 * Used for defining rectangular shapes in boundaries, keepouts, etc.
 *
 * Format: (rect <layer> <x1> <y1> <x2> <y2>)
 * Example: (rect signal 0 0 100 50)
 */
export interface DsnRectConstructorParams {
  layer?: string
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

export class DsnRect extends SxClass {
  static override token = "rect"
  token = "rect"

  private _layer?: string
  private _x1?: number
  private _y1?: number
  private _x2?: number
  private _y2?: number

  constructor(params: DsnRectConstructorParams = {}) {
    super()
    if (params.layer !== undefined) this.layer = params.layer
    if (params.x1 !== undefined) this.x1 = params.x1
    if (params.y1 !== undefined) this.y1 = params.y1
    if (params.x2 !== undefined) this.x2 = params.x2
    if (params.y2 !== undefined) this.y2 = params.y2
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnRect {
    const rect = new DsnRect()

    const stringPrim = primitiveSexprs.find((p) => typeof p === "string")
    if (stringPrim) rect._layer = stringPrim as string

    const numbers = primitiveSexprs.filter((p) => typeof p === "number") as number[]
    if (numbers.length >= 4) {
      rect._x1 = numbers[0]
      rect._y1 = numbers[1]
      rect._x2 = numbers[2]
      rect._y2 = numbers[3]
    }

    return rect
  }

  get layer(): string | undefined {
    return this._layer
  }

  set layer(value: string | undefined) {
    this._layer = value
  }

  get x1(): number | undefined {
    return this._x1
  }

  set x1(value: number | undefined) {
    this._x1 = value
  }

  get y1(): number | undefined {
    return this._y1
  }

  set y1(value: number | undefined) {
    this._y1 = value
  }

  get x2(): number | undefined {
    return this._x2
  }

  set x2(value: number | undefined) {
    this._x2 = value
  }

  get y2(): number | undefined {
    return this._y2
  }

  set y2(value: number | undefined) {
    this._y2 = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._layer) parts.push(this._layer)
    if (this._x1 !== undefined) parts.push(String(this._x1))
    if (this._y1 !== undefined) parts.push(String(this._y1))
    if (this._x2 !== undefined) parts.push(String(this._x2))
    if (this._y2 !== undefined) parts.push(String(this._y2))
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnRect)
