import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesPath represents a (path ...) shape descriptor in SES files.
 * Used for defining wire paths in network_out.
 *
 * Format: (path <layer> <width> <x1> <y1> <x2> <y2> ...)
 * Example: (path 2 1772 45016 -138866 19999 -113849)
 */
export interface SesPathConstructorParams {
  layer?: string | number
  width?: number
  coordinates?: number[]
}

export class SesPath extends SxClass {
  static override token = "path"
  static override parentToken = "wire"
  token = "path"

  private _layer?: string | number
  private _width?: number
  private _coordinates: number[] = []

  constructor(params: SesPathConstructorParams = {}) {
    super()
    if (params.layer !== undefined) this._layer = params.layer
    if (params.width !== undefined) this._width = params.width
    if (params.coordinates !== undefined)
      this._coordinates = [...params.coordinates]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesPath {
    const path = new SesPath()

    // First element is layer (can be string or number)
    if (primitiveSexprs.length > 0) {
      const first = primitiveSexprs[0]
      if (typeof first === "string" || typeof first === "number") {
        path._layer = first
      }
    }

    // Second element is width
    if (primitiveSexprs.length > 1 && typeof primitiveSexprs[1] === "number") {
      path._width = primitiveSexprs[1]
    }

    // Remaining numbers are coordinates
    for (let i = 2; i < primitiveSexprs.length; i++) {
      if (typeof primitiveSexprs[i] === "number") {
        path._coordinates.push(primitiveSexprs[i] as number)
      }
    }

    return path
  }

  get layer(): string | number | undefined {
    return this._layer
  }

  set layer(value: string | number | undefined) {
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

    if (this._layer !== undefined) parts.push(String(this._layer))
    if (this._width !== undefined) parts.push(String(this._width))
    for (const coord of this._coordinates) {
      parts.push(String(coord))
    }

    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(SesPath)
