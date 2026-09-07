import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnPlace represents a (place ...) definition for component placement.
 * Format: (place <component_ref> <x> <y> <side> <rotation>)
 */
export interface DsnPlaceConstructorParams {
  componentRef?: string
  x?: number
  y?: number
  side?: string
  rotation?: number
}

export class DsnPlace extends SxClass {
  static override token = "place"
  static override parentToken = "component"
  token = "place"

  private _componentRef?: string
  private _x?: number
  private _y?: number
  private _side?: string
  private _rotation?: number

  constructor(params: DsnPlaceConstructorParams = {}) {
    super()
    if (params.componentRef !== undefined)
      this.componentRef = params.componentRef
    if (params.x !== undefined) this.x = params.x
    if (params.y !== undefined) this.y = params.y
    if (params.side !== undefined) this.side = params.side
    if (params.rotation !== undefined) this.rotation = params.rotation
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPlace {
    const place = new DsnPlace()
    const [componentRef, x, y, side, rotation] = primitiveSexprs
    if (typeof componentRef === "string" || typeof componentRef === "number") {
      place._componentRef = String(componentRef)
    }
    if (typeof x === "number") place._x = x
    if (typeof y === "number") place._y = y
    if (typeof side === "string") place._side = side
    if (typeof rotation === "number") place._rotation = rotation
    return place
  }

  get componentRef(): string | undefined {
    return this._componentRef
  }

  set componentRef(value: string | undefined) {
    this._componentRef = value
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

  get side(): string | undefined {
    return this._side
  }

  set side(value: string | undefined) {
    this._side = value
  }

  get rotation(): number | undefined {
    return this._rotation
  }

  set rotation(value: number | undefined) {
    this._rotation = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._componentRef) parts.push(this._componentRef)
    if (this._x !== undefined) parts.push(String(this._x))
    if (this._y !== undefined) parts.push(String(this._y))
    if (this._side) parts.push(this._side)
    if (this._rotation !== undefined) parts.push(String(this._rotation))
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnPlace)
