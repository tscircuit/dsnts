import { parseSpectraDsn, SpectraDsn } from "../sexpr"
import { collectShapesFromContext, getDsnContext } from "./collectShapes"
import { renderSvg } from "./renderSvg"
import { calculateViewBox } from "./viewBox"
import type { SvgGenerationOptions } from "./types"

const DEFAULT_PADDING = 4

export const generateSvgFromDsn = (
  dsnInput: string | SpectraDsn,
  options: SvgGenerationOptions = {},
): string => {
  const dsn =
    typeof dsnInput === "string" ? parseSpectraDsn(dsnInput) : dsnInput
  const context = getDsnContext(dsn)
  const shapes = collectShapesFromContext(context)
  const viewBox = calculateViewBox(shapes, options.padding ?? DEFAULT_PADDING)

  return renderSvg(shapes, viewBox, options)
}
