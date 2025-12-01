import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnPlace } from "./DsnPlace"

/**
 * DsnComponent represents a (component ...) definition in the placement section.
 * Defines a component with its image reference and optional placement info.
 *
 * Format: (component <image_id>)
 * Example: (component "SOT23-3"
 *            (place "U1" 100 200 front 90))
 *
 * Children can include:
 * - place: Placement instances referencing this component
 */
export interface DsnComponentConstructorParams {
  imageId?: string
  places?: DsnPlace[]
  otherChildren?: SxClass[]
}

export class DsnComponent extends SxClass {
  static override token = "component"
  static override parentToken = "placement"
  token = "component"

  private _imageId?: string
  private _places: DsnPlace[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnComponentConstructorParams = {}) {
    super()
    if (params.imageId !== undefined) this.imageId = params.imageId
    if (params.places !== undefined) this.places = params.places
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnComponent {
    const component = new DsnComponent()

    // First primitive is the image ID
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      component.imageId = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnComponent.token,
      })

      if (parsed instanceof SxClass) {
        component.consumeChild(parsed)
      }
    }

    return component
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnPlace) {
      this._places.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get imageId(): string | undefined {
    return this._imageId
  }

  set imageId(value: string | undefined) {
    this._imageId = value
  }

  get places(): DsnPlace[] {
    return [...this._places]
  }

  set places(value: DsnPlace[]) {
    this._places = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._places)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    if (this._imageId) {
      lines.push(`  ${JSON.stringify(this._imageId)}`)
    }

    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(DsnComponent)
