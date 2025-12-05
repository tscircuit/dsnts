import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnPlacement } from "./DsnPlacement"
import { DsnComponent } from "./DsnComponent"
import { DsnResolution } from "./DsnResolution"
import { DsnUnit } from "./DsnUnit"

/**
 * SesPlacement extends DsnPlacement for use in SES (session) files.
 * The structure is identical to DSN placement but occurs under the session token.
 */
export class SesPlacement extends DsnPlacement {
  static override parentToken = "session"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesPlacement {
    const placement = new SesPlacement()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnPlacement.token,
      })

      if (parsed instanceof SxClass) {
        if (parsed instanceof DsnComponent) {
          ;(placement as any)._components.push(parsed)
        } else if (parsed instanceof DsnResolution) {
          ;(placement as any)._resolution = parsed
        } else if (parsed instanceof DsnUnit) {
          ;(placement as any)._unit = parsed
        } else {
          ;(placement as any)._otherChildren.push(parsed)
        }
      }
    }

    return placement
  }
}

SxClass.register(SesPlacement)
