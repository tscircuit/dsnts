import type { DsnBoundary, DsnStructure, SpectraDsn } from "../sexpr"

type Point = { x: number; y: number }

export interface SvgPathElement {
  kind: "path"
  points: Point[]
  strokeWidth: number
  layer?: string
  closed?: boolean
}

export interface SvgRectElement {
  kind: "rect"
  x: number
  y: number
  width: number
  height: number
  strokeWidth: number
  layer?: string
}

export interface SvgCircleElement {
  kind: "circle"
  cx: number
  cy: number
  r: number
  strokeWidth: number
  layer?: string
}

export type SvgRenderable = SvgPathElement | SvgRectElement | SvgCircleElement

export interface SvgGenerationOptions {
  padding?: number
  strokeColor?: string
  fillColor?: string
}

export interface SvgViewBox {
  minX: number
  minY: number
  width: number
  height: number
}

export interface SvgExtractionContext {
  dsn: SpectraDsn
  structure?: DsnStructure
  boundary?: DsnBoundary
}
