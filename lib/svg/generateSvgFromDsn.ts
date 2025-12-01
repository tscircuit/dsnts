import { stringify, type INode } from "svgson"
import { expandBoundsToViewBox, calculateBounds } from "./bounds"
import { extractBoundaryShapes } from "./extractBoundaryShapes"
import {
  type GenerateSvgOptions,
  type SvgChildNode,
  type ViewBox,
} from "./types"
import { createBackgroundNode, shapesToSvgNodes } from "./svgElements"
import { SpectraDsn } from "../sexpr/classes/SpectraDsn"

const DEFAULT_PADDING = 8
const DEFAULT_BACKGROUND = "#ffffff"

const buildSvgRoot = (viewBox: ViewBox, children: SvgChildNode[]): INode => ({
  name: "svg",
  type: "element",
  value: "",
  attributes: {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`,
    width: String(viewBox.width),
    height: String(viewBox.height),
  },
  children,
})

export const generateSvgFromDsn = (
  dsn: SpectraDsn,
  options: GenerateSvgOptions = {},
): string => {
  const padding = options.padding ?? DEFAULT_PADDING
  const backgroundColor = options.backgroundColor ?? DEFAULT_BACKGROUND
  const shapes = dsn.structure?.boundary
    ? extractBoundaryShapes(dsn.structure.boundary)
    : []

  const bounds = calculateBounds(shapes)
  const viewBox = expandBoundsToViewBox(bounds, padding)

  const svgChildren: SvgChildNode[] = [
    createBackgroundNode(viewBox, backgroundColor),
    ...shapesToSvgNodes(shapes, options),
  ]

  const svgRoot = buildSvgRoot(viewBox, svgChildren)

  return stringify(svgRoot, { selfClose: true })
}
