import { SxClass } from "./base-classes/SxClass"
import { SpectraDsn } from "./classes/SpectraDsn"
import { SpectraSes } from "./classes/SpectraSes"

/**
 * Generic S-expression parser.
 * Parses any S-expression string and returns the appropriate class instances.
 */
export const parseKicadSexpr = (sexpr: string) => {
  return SxClass.parse(sexpr)
}

// Alias for Specctra DSN naming (generic S-expression parser)
export const parseSpectraSexpr = parseKicadSexpr

/**
 * Parse a Specctra DSN (Design) file.
 * DSN files start with (pcb ...) and contain board structure,
 * component placement, nets, and design rules.
 */
export const parseSpectraDsn = (sexpr: string): SpectraDsn => {
  const [root] = parseSpectraSexpr(sexpr)
  if (!(root instanceof SpectraDsn)) {
    throw new Error(
      `Expected SpectraDsn root with token "pcb", got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

/**
 * Parse a Specctra SES (Session) file.
 * SES files start with (session ...) and contain routing results
 * from an autorouter.
 */
export const parseSpectraSes = (sexpr: string): SpectraSes => {
  const [root] = parseSpectraSexpr(sexpr)
  if (!(root instanceof SpectraSes)) {
    throw new Error(
      `Expected SpectraSes root with token "session", got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}
