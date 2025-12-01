import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnType } from "./DsnType"
import { DsnProperty } from "./DsnProperty"

/**
 * DsnLayer represents a (layer ...) definition in structure.
 * Format: (layer <layer_name> (type <type_value>) (property (index <value>)))
 * Example: (layer F.Cu (type signal) (property (index 0)))
 */
export interface DsnLayerConstructorParams {
  layerName?: string
  type?: string
  index?: number
}

export class DsnLayer extends SxClass {
  static override token = "layer"
  static override parentToken?: string = "structure"
  token = "layer"

  private _layerName?: string
  private _sxType?: DsnType
  private _sxProperty?: DsnProperty

  constructor(params: DsnLayerConstructorParams = {}) {
    super()
    if (params.layerName !== undefined) this.layerName = params.layerName
    if (params.type !== undefined) this.type = params.type
    if (params.index !== undefined) this.index = params.index
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnLayer {
    const layer = new DsnLayer()

    // First string is the layer name
    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        layer._layerName = primitive
        break
      }
    }

    // Parse nested elements (type and property) - only arrays
    const nestedElements = primitiveSexprs.filter((p) => Array.isArray(p))
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      nestedElements,
      "layer",
    )

    layer._sxType = propertyMap.type as DsnType | undefined
    layer._sxProperty = propertyMap.property as DsnProperty | undefined

    return layer
  }

  get layerName(): string | undefined {
    return this._layerName
  }

  set layerName(value: string | undefined) {
    this._layerName = value
  }

  get type(): string | undefined {
    return this._sxType?.typeValue
  }

  set type(value: string | undefined) {
    if (value === undefined) {
      this._sxType = undefined
      return
    }
    this._sxType = new DsnType({ typeValue: value })
  }

  get index(): number | undefined {
    return this._sxProperty?.index
  }

  set index(value: number | undefined) {
    if (value === undefined) {
      this._sxProperty = undefined
      return
    }
    this._sxProperty = new DsnProperty({ index: value })
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxType) children.push(this._sxType)
    if (this._sxProperty) children.push(this._sxProperty)
    return children
  }

  override getString(): string {
    const children = this.getChildren()

    // If no children and no layer name, return simple form
    if (children.length === 0 && !this._layerName) {
      return `(${this.token})`
    }

    // If layer name but no children, return single-line form
    if (children.length === 0 && this._layerName) {
      return `(${this.token} ${this._layerName})`
    }

    // Multi-line form with children
    const lines = [`(${this.token}`]

    // Add layer name on the same line
    if (this._layerName) {
      lines[0] += ` ${this._layerName}`
    }

    // Add nested children
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

// Register for structure parent (DSN files)
SxClass.register(DsnLayer)

// Also register as default to handle parsing without parent context
SxClass.register(
  class extends DsnLayer {
    static override parentToken = undefined
  },
)
