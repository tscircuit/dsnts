import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPolygon represents a (polygon ...) shape descriptor.
 * Used for defining polygon shapes in padstacks, planes, and boundaries.
 *
 * Format: (polygon <layer> <aperture_width> <x1> <y1> <x2> <y2> ...)
 * Example: (polygon F.Cu 0 -3555 1595 3555 1595 3555 -755 -3555 -755 -3555 1595)
 */
export interface DsnPolygonConstructorParams {
  layer?: string
  apertureWidth?: number
  coordinates?: number[]
}

export class DsnPolygon extends SxClass {
  static override token = "polygon"
  token = "polygon"

  private _layer?: string
  private _apertureWidth?: number
  private _coordinates: number[] = []

  constructor(params: DsnPolygonConstructorParams = {}) {
    super()
    if (params.layer !== undefined) this.layer = params.layer
    if (params.apertureWidth !== undefined)
      this.apertureWidth = params.apertureWidth
    if (params.coordinates !== undefined) this.coordinates = params.coordinates
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPolygon {
    const polygon = new DsnPolygon()

    // Parse layer (first string)
    const layerIndex = primitiveSexprs.findIndex((p) => typeof p === "string")
    if (layerIndex >= 0) {
      polygon._layer = primitiveSexprs[layerIndex] as string
    }

    // Parse aperture width (first number)
    const widthIndex = primitiveSexprs.findIndex((p) => typeof p === "number")
    if (widthIndex >= 0) {
      polygon._apertureWidth = primitiveSexprs[widthIndex] as number
    }

    // Remaining numbers are coordinates
    for (let i = widthIndex + 1; i < primitiveSexprs.length; i++) {
      if (typeof primitiveSexprs[i] === "number") {
        polygon._coordinates.push(primitiveSexprs[i] as number)
      }
    }

    return polygon
  }

  get layer(): string | undefined {
    return this._layer
  }

  set layer(value: string | undefined) {
    this._layer = value
  }

  get apertureWidth(): number | undefined {
    return this._apertureWidth
  }

  set apertureWidth(value: number | undefined) {
    this._apertureWidth = value
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
    if (this._apertureWidth !== undefined) {
      parts.push(String(this._apertureWidth))
    }
    for (const coord of this._coordinates) {
      parts.push(String(coord))
    }

    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnPolygon)
