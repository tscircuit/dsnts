import type { INode } from "svgson"

export type BoundaryShape =
  | {
      kind: "rect"
      layer?: string
      x1: number
      y1: number
      x2: number
      y2: number
    }
  | {
      kind: "path"
      layer?: string
      width?: number
      points: { x: number; y: number }[]
    }

export interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

export interface GenerateSvgOptions {
  padding?: number
  backgroundColor?: string
  strokeColor?: string
  strokeWidth?: number
}

export type SvgChildNode = INode
