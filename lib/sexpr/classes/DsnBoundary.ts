import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnCircle } from "./DsnCircle"
import { DsnPath } from "./DsnPath"
import { DsnPolygon } from "./DsnPolygon"
import { DsnRect } from "./DsnRect"

/**
 * DsnBoundary represents the (boundary ...) token in DSN structure section.
 * Defines the board outline/boundary using paths or rectangles.
 * Format: (boundary <path_descriptor>)
 * Example: (boundary (path pcb 0 100 100 0 0))
 */
export interface DsnBoundaryConstructorParams {
  paths?: DsnPath[]
  rects?: DsnRect[]
  polygons?: DsnPolygon[]
  circles?: DsnCircle[]
  otherChildren?: SxClass[]
}

export class DsnBoundary extends SxClass {
  static override token = "boundary"
  static override parentToken = "structure"
  token = "boundary"

  private _paths: DsnPath[] = []
  private _rects: DsnRect[] = []
  private _polygons: DsnPolygon[] = []
  private _circles: DsnCircle[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnBoundaryConstructorParams = {}) {
    super()
    if (params.paths !== undefined) this.paths = params.paths
    if (params.rects !== undefined) this.rects = params.rects
    if (params.polygons !== undefined) this.polygons = params.polygons
    if (params.circles !== undefined) this.circles = params.circles
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
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
        boundary.consumeChild(parsed)
      }
    }

    return boundary
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnPath) {
      this._paths.push(child)
      return
    }
    if (child instanceof DsnRect) {
      this._rects.push(child)
      return
    }
    if (child instanceof DsnPolygon) {
      this._polygons.push(child)
      return
    }
    if (child instanceof DsnCircle) {
      this._circles.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get paths(): DsnPath[] {
    return [...this._paths]
  }

  set paths(value: DsnPath[]) {
    this._paths = [...value]
  }

  get rects(): DsnRect[] {
    return [...this._rects]
  }

  set rects(value: DsnRect[]) {
    this._rects = [...value]
  }

  get polygons(): DsnPolygon[] {
    return [...this._polygons]
  }

  set polygons(value: DsnPolygon[]) {
    this._polygons = [...value]
  }

  get circles(): DsnCircle[] {
    return [...this._circles]
  }

  set circles(value: DsnCircle[]) {
    this._circles = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._paths)
    children.push(...this._rects)
    children.push(...this._polygons)
    children.push(...this._circles)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnBoundary)
