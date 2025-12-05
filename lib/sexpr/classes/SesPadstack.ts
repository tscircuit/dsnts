import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { DsnPadstack } from "./DsnPadstack"
import { DsnShape } from "./DsnShape"

/**
 * SesPadstack extends DsnPadstack for use in SES library_out section.
 * The structure is identical to DSN padstack but occurs under library_out.
 */
export class SesPadstack extends DsnPadstack {
  static override parentToken = "library_out"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SesPadstack {
    const padstack = new SesPadstack()

    // First primitive is the padstack ID
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      ;(padstack as any)._padstackId = primitiveSexprs[0]
    }

    // Parse remaining children
    for (let i = 1; i < primitiveSexprs.length; i++) {
      const primitive = primitiveSexprs[i]
      if (!Array.isArray(primitive) || primitive.length === 0) continue

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: DsnPadstack.token,
      })

      if (parsed instanceof SxClass) {
        if (parsed instanceof DsnShape) {
          ;(padstack as any)._shapes.push(parsed)
        } else {
          ;(padstack as any)._otherChildren.push(parsed)
        }
      }
    }

    return padstack
  }
}

SxClass.register(SesPadstack)
