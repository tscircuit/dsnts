import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnBoundary } from "./DsnBoundary"

/**
 * DsnStructure represents the (structure ...) section in DSN files.
 * Contains the board physical structure including boundary, layers,
 * design rules, vias, keepouts, etc.
 *
 * Typical children:
 * - boundary: Board outline
 * - layer: Layer definitions
 * - rule: Design rules
 * - via: Via definitions
 * - control: Layer pair controls
 * - keepout: Keepout zones
 */
export interface DsnStructureConstructorParams {
  boundary?: DsnBoundary
  otherChildren?: SxClass[]
}

export class DsnStructure extends SxClass {
  static override token = "structure"
  static override parentToken = "pcb"
  token = "structure"

  private _boundary?: DsnBoundary
  private _otherChildren: SxClass[] = []

  constructor(params: DsnStructureConstructorParams = {}) {
    super()
    if (params.boundary !== undefined) this.boundary = params.boundary
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnStructure {
    const structure = new DsnStructure()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnStructure.token,
      })

      if (parsed instanceof SxClass) {
        structure.consumeChild(parsed)
      }
    }

    return structure
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnBoundary) {
      this._boundary = child
      return
    }

    // TODO: Add more specific DSN structure children as they're implemented
    // - DsnLayer
    // - DsnRule
    // - DsnVia (DSN-specific, different from KiCad)
    // - DsnControl
    // - DsnKeepout

    this._otherChildren.push(child)
  }

  get boundary(): DsnBoundary | undefined {
    return this._boundary
  }

  set boundary(value: DsnBoundary | undefined) {
    this._boundary = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._boundary) children.push(this._boundary)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnStructure)
