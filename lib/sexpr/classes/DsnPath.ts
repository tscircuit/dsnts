import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPath represents a (path ...) shape descriptor.
 * Used for defining paths in boundaries, outlines, wires, etc.
 *
 * Format: (path <layer> <width> <x1> <y1> <x2> <y2> ...)
 * Example: (path signal 10 0 0 100 0 100 100 0 100 0 0)
 */
export interface DsnPathConstructorParams {
  layer?: string
  width?: number
  coordinates?: number[]
}

export class DsnPath extends SxClass {
  static override token = "path"
  token = "path"

  private _layer?: string
  private _width?: number
  private _coordinates: number[] = []

  constructor(params: DsnPathConstructorParams = {}) {
    super()
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.coordinates !== undefined) this.coordinates = params.coordinates
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPath {
    const path = new DsnPath()

    // Parse positionally - the layer name can be a number or string
    const primitives = primitiveSexprs.filter(
      (p) => typeof p === "string" || typeof p === "number",
    ) as (string | number)[]

    if (primitives[0] !== undefined) path._layer = String(primitives[0])
    if (typeof primitives[1] === "number") path._width = primitives[1]

    // Remaining numbers are coordinates
    for (const prim of primitives.slice(2)) {
      if (typeof prim === "number") {
        path._coordinates.push(prim)
      }
    }

    return path
  }

  get layer(): string | undefined {
    return this._layer
  }

  set layer(value: string | undefined) {
    this._layer = value
  }

  get width(): number | undefined {
    return this._width
  }

  set width(value: number | undefined) {
    this._width = value
  }

  get coordinates(): number[] {
    return [...this._coordinates]
  }

  set coordinates(value: number[]) {
    this._coordinates = [...value]
  }

  override getString(): string {
    const parts = [`(${this.token}`]

    if (this._layer) {
      parts.push(this._layer)
    }
    if (this._width !== undefined) {
      parts.push(String(this._width))
    }
    for (const coord of this._coordinates) {
      parts.push(String(coord))
    }

    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnPath)
