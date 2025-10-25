import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { quoteSExprString } from "../utils/quoteSExprString"

/**
 * DsnParser represents the (parser ...) token in DSN files.
 * This identifies the parser/tool that created or will read the DSN file.
 * Example: (parser "Specctra_DSN") or (parser dsnts)
 */
export class DsnParser extends SxPrimitiveString {
  static override token = "parser"
  static override parentToken = "pcb"
  token = "parser"

  override getString(): string {
    const needsQuotes = !/^[A-Za-z0-9._-]+$/.test(this.value)
    return `(parser ${needsQuotes ? quoteSExprString(this.value) : this.value})`
  }
}

SxClass.register(DsnParser)
