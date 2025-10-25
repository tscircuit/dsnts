import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnLayer represents a (layer ...) definition in structure.
 * Format: (layer <layer_name> <type> <direction>)
 * Example: (layer "TOP" signal)
 */
export interface DsnLayerConstructorParams {
  layerName?: string
  type?: string
  direction?: string
}

export class DsnLayer extends SxClass {
  static override token = "layer"
  static override parentToken = "structure"
  token = "layer"

  private _layerName?: string
  private _type?: string
  private _direction?: string

  constructor(params: DsnLayerConstructorParams = {}) {
    super()
    if (params.layerName !== undefined) this.layerName = params.layerName
    if (params.type !== undefined) this.type = params.type
    if (params.direction !== undefined) this.direction = params.direction
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnLayer {
    const layer = new DsnLayer()
    const strings = primitiveSexprs.filter((p) => typeof p === "string") as string[]
    if (strings[0]) layer._layerName = strings[0]
    if (strings[1]) layer._type = strings[1]
    if (strings[2]) layer._direction = strings[2]
    return layer
  }

  get layerName(): string | undefined {
    return this._layerName
  }

  set layerName(value: string | undefined) {
    this._layerName = value
  }

  get type(): string | undefined {
    return this._type
  }

  set type(value: string | undefined) {
    this._type = value
  }

  get direction(): string | undefined {
    return this._direction
  }

  set direction(value: string | undefined) {
    this._direction = value
  }

  override getString(): string {
    const parts = [`(${this.token}`]
    if (this._layerName) parts.push(JSON.stringify(this._layerName))
    if (this._type) parts.push(this._type)
    if (this._direction) parts.push(this._direction)
    parts.push(")")
    return parts.join(" ")
  }
}

SxClass.register(DsnLayer)
