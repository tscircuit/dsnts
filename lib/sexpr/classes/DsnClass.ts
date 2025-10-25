import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

/**
 * DsnClass represents a (class ...) definition in the network section.
 * Defines a net class that groups nets with similar routing rules.
 *
 * Format: (class <class_name> <net_name> <net_name> ...)
 * Example: (class "POWER" "VCC" "GND" "VDD")
 *
 * Children can include:
 * - rule: Class-specific routing rules
 * - circuit: Circuit definitions
 * - property: Class properties
 */
export interface DsnClassConstructorParams {
  className?: string
  netNames?: string[]
  rules?: SxClass[]
  otherChildren?: SxClass[]
}

export class DsnClass extends SxClass {
  static override token = "class"
  static override parentToken = "network"
  token = "class"

  private _className?: string
  private _netNames: string[] = []
  private _rules: SxClass[] = []
  private _otherChildren: SxClass[] = []

  constructor(params: DsnClassConstructorParams = {}) {
    super()
    if (params.className !== undefined) this.className = params.className
    if (params.netNames !== undefined) this.netNames = params.netNames
    if (params.rules !== undefined) this.rules = params.rules
    if (params.otherChildren !== undefined)
      this.otherChildren = params.otherChildren
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DsnClass {
    const dsnClass = new DsnClass()

    // First primitive is the class name
    if (
      primitiveSexprs.length > 0 &&
      typeof primitiveSexprs[0] === "string"
    ) {
      dsnClass.className = primitiveSexprs[0]
    }

    // Remaining primitives can be net name strings or child elements
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]

      if (typeof primitive === "string") {
        // Net name string
        dsnClass._netNames.push(primitive)
      } else if (Array.isArray(primitive) && primitive.length > 0) {
        // Child element
        const parsed = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: DsnClass.token,
        })

        if (parsed instanceof SxClass) {
          // TODO: Route to specific rule array when rule class exists
          dsnClass._otherChildren.push(parsed)
        }
      }
    }

    return dsnClass
  }

  get className(): string | undefined {
    return this._className
  }

  set className(value: string | undefined) {
    this._className = value
  }

  get netNames(): string[] {
    return [...this._netNames]
  }

  set netNames(value: string[]) {
    this._netNames = [...value]
  }

  get rules(): SxClass[] {
    return [...this._rules]
  }

  set rules(value: SxClass[]) {
    this._rules = [...value]
  }

  get otherChildren(): SxClass[] {
    return [...this._otherChildren]
  }

  set otherChildren(value: SxClass[]) {
    this._otherChildren = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._rules)
    children.push(...this._otherChildren)
    return children
  }

  override getString(): string {
    const children = this.getChildren()
    const lines = [`(${this.token}`]

    if (this._className) {
      lines.push(`  ${JSON.stringify(this._className)}`)
    }

    // Add net names
    for (const netName of this._netNames) {
      lines.push(`  ${JSON.stringify(netName)}`)
    }

    // Add child elements
    for (const child of children) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}

SxClass.register(DsnClass)
