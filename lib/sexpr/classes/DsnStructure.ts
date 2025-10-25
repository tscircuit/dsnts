import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnBoundary } from "./DsnBoundary"
import { DsnControl } from "./DsnControl"
import { DsnKeepout } from "./DsnKeepout"
import { DsnLayer } from "./DsnLayer"
import { DsnRule } from "./DsnRule"
import { DsnVia } from "./DsnVia"

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
  layers?: DsnLayer[]
  rules?: DsnRule[]
  vias?: DsnVia[]
  control?: DsnControl
  keepouts?: DsnKeepout[]
  otherChildren?: SxClass[]
}

export class DsnStructure extends SxClass {
  static override token = "structure"
  static override parentToken = "pcb"
  token = "structure"

  private _boundary?: DsnBoundary
  private _layers: DsnLayer[] = []
  private _rules: DsnRule[] = []
  private _vias: DsnVia[] = []
  private _control?: DsnControl
  private _keepouts: DsnKeepout[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnStructureConstructorParams = {}) {
    super()
    if (params.boundary !== undefined) this.boundary = params.boundary
    if (params.layers !== undefined) this.layers = params.layers
    if (params.rules !== undefined) this.rules = params.rules
    if (params.vias !== undefined) this.vias = params.vias
    if (params.control !== undefined) this.control = params.control
    if (params.keepouts !== undefined) this.keepouts = params.keepouts
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
    if (child instanceof DsnLayer) {
      this._layers.push(child)
      return
    }
    if (child instanceof DsnRule) {
      this._rules.push(child)
      return
    }
    if (child instanceof DsnVia) {
      this._vias.push(child)
      return
    }
    if (child instanceof DsnControl) {
      this._control = child
      return
    }
    if (child instanceof DsnKeepout) {
      this._keepouts.push(child)
      return
    }

    this._otherChildren.push(child)
  }

  get boundary(): DsnBoundary | undefined {
    return this._boundary
  }

  set boundary(value: DsnBoundary | undefined) {
    this._boundary = value
  }

  get layers(): DsnLayer[] {
    return [...this._layers]
  }

  set layers(value: DsnLayer[]) {
    this._layers = [...value]
  }

  get rules(): DsnRule[] {
    return [...this._rules]
  }

  set rules(value: DsnRule[]) {
    this._rules = [...value]
  }

  get vias(): DsnVia[] {
    return [...this._vias]
  }

  set vias(value: DsnVia[]) {
    this._vias = [...value]
  }

  get control(): DsnControl | undefined {
    return this._control
  }

  set control(value: DsnControl | undefined) {
    this._control = value
  }

  get keepouts(): DsnKeepout[] {
    return [...this._keepouts]
  }

  set keepouts(value: DsnKeepout[]) {
    this._keepouts = [...value]
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
    children.push(...this._layers)
    children.push(...this._rules)
    children.push(...this._vias)
    if (this._control) children.push(this._control)
    children.push(...this._keepouts)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(DsnStructure)
