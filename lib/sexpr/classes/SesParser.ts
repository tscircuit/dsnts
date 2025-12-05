import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * SesParser represents the (parser ...) section in SES routes.
 * Contains parser-related information (usually empty in output files).
 */
export class SesParser extends SxClass {
  static override token = "parser"
  static override parentToken = "routes"
  token = "parser"

  private _otherChildren: SxClass[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesParser {
    const parser = new SesParser()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: SesParser.token,
      })

      if (parsed instanceof SxClass) {
        parser._otherChildren.push(parsed)
      }
    }

    return parser
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

  override getString(): string {
    const children = this.getChildren()
    if (children.length === 0) {
      return "(parser\n)"
    }

    const lines = [`(${this.token}`]
    for (const child of children) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(SesParser)
