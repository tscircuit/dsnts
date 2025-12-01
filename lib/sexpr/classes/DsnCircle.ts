import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnCircle represents a (circle ...) or (circ ...) shape descriptor.
 * Used for defining circular shapes in keepouts, padstacks, and shapes.
 *
 * Format: (circle <layer> <diameter> [<x> <y>])
 * Example: (circle F.Cu 3200)
 * Example: (circ signal 115.433071 0.000000 86.614173)
 */
export interface DsnCircleConstructorParams {
  layer?: string
  diameter?: number
  x?: number
  y?: number
}

export class DsnCircle extends SxClass {
  static override token = "circle"
  token = "circle"

  private _layer?: string
  private _diameter?: number
  private _x?: number
  private _y?: number

  constructor(params: DsnCircleConstructorParams = {}) {
    super()
    if (params.layer !== undefined) this.layer = params.layer
    if (params.diameter !== undefined) this.diameter = params.diameter
    if (params.x !== undefined) this.x = params.x
    if (params.y !== undefined) this.y = params.y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnCircle {
    const circle = new DsnCircle()

    // Parse layer (first string)
    const layerIndex = primitiveSexprs.findIndex((p) => typeof p === "string")
    if (layerIndex >= 0) {
      circle._layer = primitiveSexprs[layerIndex] as string
    }

    // Parse numbers: diameter, x, y
    const numbers = primitiveSexprs.filter(
      (p) => typeof p === "number",
    ) as number[]
    if (numbers.length > 0) circle._diameter = numbers[0]
    if (numbers.length > 1) circle._x = numbers[1]
    if (numbers.length > 2) circle._y = numbers[2]

    return circle
  }

  get layer(): string | undefined {
    return this._layer
  }

  set layer(value: string | undefined) {
    this._layer = value
  }

  get diameter(): number | undefined {
    return this._diameter
  }

  set diameter(value: number | undefined) {
    this._diameter = value
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

    if (this._layer) parts.push(this._layer)
    if (this._diameter !== undefined) parts.push(String(this._diameter))
    if (this._x !== undefined) parts.push(String(this._x))
    if (this._y !== undefined) parts.push(String(this._y))

    parts.push(")")
    return parts.join(" ")
  }
}

// Register for various parent contexts
SxClass.register(DsnCircle)

// Also register "circ" as an alias for circle
SxClass.register(
  class DsnCirc extends DsnCircle {
    static override token = "circ"
    override token = "circ"
  },
)
