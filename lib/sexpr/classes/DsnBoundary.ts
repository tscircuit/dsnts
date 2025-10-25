import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnBoundary represents the (boundary ...) token in DSN structure section.
 * Defines the board outline/boundary using paths or rectangles.
 * Format: (boundary <path_descriptor>)
 * Example: (boundary (path pcb 0 100 100 0 0))
 *
 * Note: This is a simplified implementation. Full DSN boundary can have
 * complex shapes with paths, rectangles, polygons, etc.
 */
export class DsnBoundary extends SxClass {
  static override token = "boundary"
  static override parentToken = "structure"
  token = "boundary"

  private _otherChildren: SxClass[] = []

  constructor(params: { otherChildren?: SxClass[] } = {}) {
    super()
    if (params.otherChildren !== undefined) {
      this.otherChildren = params.otherChildren
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnBoundary {
    const boundary = new DsnBoundary()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnBoundary.token,
      })

      if (parsed instanceof SxClass) {
        boundary._otherChildren.push(parsed)
      }
    }

    return boundary
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._otherChildren]
  }
}

SxClass.register(DsnBoundary)
