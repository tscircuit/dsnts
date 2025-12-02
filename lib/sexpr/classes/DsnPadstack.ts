import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnShape } from "./DsnShape"

/**
 * DsnPadstack represents a (padstack ...) definition in the library section.
 * Padstacks define pad shapes for different layers.
 *
 * Format: (padstack <padstack_id> ...)
 * Example: (padstack "round_50" (shape (circle signal 50)))
 *
 * Children can include:
 * - shape: Shape definitions per layer
 * - attach: Attachment type
 * - property: Padstack properties
 */
export interface DsnPadstackConstructorParams {
  padstackId?: string
  shapes?: DsnShape[]
  otherChildren?: SxClass[]
}

export class DsnPadstack extends SxClass {
  static override token = "padstack"
  static override parentToken = "library"
  token = "padstack"

  private _padstackId?: string
  private _shapes: DsnShape[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnPadstackConstructorParams = {}) {
    super()
    if (params.padstackId !== undefined) this.padstackId = params.padstackId
    if (params.shapes !== undefined) this.shapes = params.shapes
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnPadstack {
    const padstack = new DsnPadstack()

    // First primitive is the padstack ID
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      padstack.padstackId = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnPadstack.token,
      })

      if (parsed instanceof SxClass) {
        padstack.consumeChild(parsed)
      }
    }

    return padstack
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnShape) {
      this._shapes.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get padstackId(): string | undefined {
    return this._padstackId
  }

  set padstackId(value: string | undefined) {
    this._padstackId = value
  }

  get shapes(): DsnShape[] {
    return [...this._shapes]
  }

  set shapes(value: DsnShape[]) {
    this._shapes = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._shapes)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()

    if (children.length === 0) {
      return this._padstackId
        ? `(${this.token} ${this._padstackId})`
        : `(${this.token})`
    }

    const lines = [`(${this.token}`]

    if (this._padstackId) {
      lines.push(`  ${this._padstackId}`)
    }

    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(DsnPadstack)
