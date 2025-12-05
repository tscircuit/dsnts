import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnResolution } from "./DsnResolution"
import { SesParser } from "./SesParser"
import { SesLibraryOut } from "./SesLibraryOut"
import { SesNetworkOut } from "./SesNetworkOut"

/**
 * SesRoutes represents the (routes ...) section in SES files.
 * Contains routing results including resolution, parser, library_out, and network_out.
 *
 * Format: (routes (resolution ...) (parser) (library_out ...) (network_out ...))
 */
export interface SesRoutesConstructorParams {
  resolution?: DsnResolution
  parser?: SesParser
  libraryOut?: SesLibraryOut
  networkOut?: SesNetworkOut
  otherChildren?: SxClass[]
}

export class SesRoutes extends SxClass {
  static override token = "routes"
  static override parentToken = "session"
  token = "routes"

  private _sxResolution?: DsnResolution
  private _sxParser?: SesParser
  private _sxLibraryOut?: SesLibraryOut
  private _sxNetworkOut?: SesNetworkOut
  private _otherChildren: SxClass[] = []

  constructor(params: SesRoutesConstructorParams = {}) {
    super()
    if (params.resolution !== undefined) this._sxResolution = params.resolution
    if (params.parser !== undefined) this._sxParser = params.parser
    if (params.libraryOut !== undefined) this._sxLibraryOut = params.libraryOut
    if (params.networkOut !== undefined) this._sxNetworkOut = params.networkOut
    if (params.otherChildren !== undefined)
      this._otherChildren = [...params.otherChildren]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesRoutes {
    const routes = new SesRoutes()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesRoutes.token,
      })

      if (parsed instanceof SxClass) {
        routes.consumeChild(parsed)
      }
    }

    return routes
  }

  private consumeChild(child: SxClass) {
    if (child instanceof DsnResolution) {
      this._sxResolution = child
      return
    }
    if (child instanceof SesParser) {
      this._sxParser = child
      return
    }
    if (child instanceof SesLibraryOut) {
      this._sxLibraryOut = child
      return
    }
    if (child instanceof SesNetworkOut) {
      this._sxNetworkOut = child
      return
    }
    this._otherChildren.push(child)
  }

  get resolution(): DsnResolution | undefined {
    return this._sxResolution
  }

  set resolution(value: DsnResolution | undefined) {
    this._sxResolution = value
  }

  get parser(): SesParser | undefined {
    return this._sxParser
  }

  set parser(value: SesParser | undefined) {
    this._sxParser = value
  }

  get libraryOut(): SesLibraryOut | undefined {
    return this._sxLibraryOut
  }

  set libraryOut(value: SesLibraryOut | undefined) {
    this._sxLibraryOut = value
  }

  get networkOut(): SesNetworkOut | undefined {
    return this._sxNetworkOut
  }

  set networkOut(value: SesNetworkOut | undefined) {
    this._sxNetworkOut = value
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxResolution) children.push(this._sxResolution)
    if (this._sxParser) children.push(this._sxParser)
    if (this._sxLibraryOut) children.push(this._sxLibraryOut)
    if (this._sxNetworkOut) children.push(this._sxNetworkOut)
    children.push(...this._otherChildren)
    return children
  }
}

SxClass.register(SesRoutes)
