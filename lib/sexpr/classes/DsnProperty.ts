import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnProperty represents a (property ...) element within a layer.
 * Contains nested elements like (index N).
 *
 * Format: (property (index <value>))
 * Example: (property (index 0))
 */
export interface DsnPropertyConstructorParams {
  index?: number
}

export class DsnProperty extends SxClass {
  static override token = "property"
  static override parentToken = "layer"
  token = "property"

  private _sxIndex?: DsnPropertyIndex

  constructor(params: DsnPropertyConstructorParams = {}) {
    super()
    if (params.index !== undefined) this.index = params.index
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnProperty {
    const property = new DsnProperty()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    property._sxIndex = propertyMap.index as DsnPropertyIndex | undefined

    return property
  }

  get index(): number | undefined {
    return this._sxIndex?.value
  }

  set index(value: number | undefined) {
    if (value === undefined) {
      this._sxIndex = undefined
      return
    }
    this._sxIndex = new DsnPropertyIndex(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxIndex) children.push(this._sxIndex)
    return children
  }
}

SxClass.register(DsnProperty)

/**
 * DsnPropertyIndex represents an (index ...) element within a property.
 * Format: (index <value>)
 * Example: (index 0)
 */
export class DsnPropertyIndex extends SxClass {
  static override token = "index"
  static override parentToken = "property"
  token = "index"

  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPropertyIndex {
    const value =
      typeof primitiveSexprs[0] === "number" ? primitiveSexprs[0] : 0
    return new DsnPropertyIndex(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(${this.token} ${this.value})`
  }
}

SxClass.register(DsnPropertyIndex)
