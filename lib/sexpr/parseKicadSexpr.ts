import { SxClass } from "./base-classes/SxClass"
import { Footprint } from "./classes/Footprint"
import { KicadPcb } from "./classes/KicadPcb"
import { KicadSch } from "./classes/KicadSch"
import { SpectraDsn } from "./classes/SpectraDsn"
import { SpectraSes } from "./classes/SpectraSes"

export const parseKicadSexpr = (sexpr: string) => {
  return SxClass.parse(sexpr)
}

// Alias for Specctra DSN naming (generic S-expression parser)
export const parseSpectraSexpr = parseKicadSexpr

export const parseKicadSch = (sexpr: string): KicadSch => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof KicadSch)) {
    throw new Error(
      `Expected KicadSch root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadPcb = (sexpr: string): KicadPcb => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof KicadPcb)) {
    throw new Error(
      `Expected KicadPcb root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

export const parseKicadMod = (sexpr: string): Footprint => {
  const [root] = parseKicadSexpr(sexpr)
  if (!(root instanceof Footprint)) {
    throw new Error(
      `Expected Footprint root, got ${root?.constructor.name ?? "undefined"}`,
    )
  }
  return root
}

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
