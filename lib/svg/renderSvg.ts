import type { SvgGenerationOptions, SvgRenderable, SvgViewBox } from "./types"

const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) return value.toString()
  return value
    .toFixed(3)
    .replace(/\.0+$/, "")
    .replace(/\.([1-9]*)0+$/, ".$1")
}

const renderPath = (
  shape: Extract<SvgRenderable, { kind: "path" }>,
): string => {
  const commands = shape.points.map((point, index) => {
    const command = index === 0 ? "M" : "L"
    return `${command}${formatNumber(point.x)} ${formatNumber(point.y)}`
  })
  const pathData = shape.closed ? `${commands.join(" ")} Z` : commands.join(" ")
  return `<path d="${pathData}" fill="none" stroke-width="${formatNumber(shape.strokeWidth)}"${renderLayerAttribute(shape.layer)} />`
}

const renderRect = (
  shape: Extract<SvgRenderable, { kind: "rect" }>,
): string => {
  return `<rect x="${formatNumber(shape.x)}" y="${formatNumber(shape.y)}" width="${formatNumber(shape.width)}" height="${formatNumber(shape.height)}" fill="none" stroke-width="${formatNumber(shape.strokeWidth)}"${renderLayerAttribute(shape.layer)} />`
}

const renderCircle = (
  shape: Extract<SvgRenderable, { kind: "circle" }>,
): string => {
  return `<circle cx="${formatNumber(shape.cx)}" cy="${formatNumber(shape.cy)}" r="${formatNumber(shape.r)}" fill="none" stroke-width="${formatNumber(shape.strokeWidth)}"${renderLayerAttribute(shape.layer)} />`
}

const renderLayerAttribute = (layer?: string): string =>
  layer ? ` data-layer="${layer}"` : ""

export const renderSvg = (
  shapes: SvgRenderable[],
  viewBox: SvgViewBox,
  options: SvgGenerationOptions,
): string => {
  const strokeColor = options.strokeColor ?? "#111"
  const fillColor = options.fillColor ?? "none"
  const viewBoxAttr = `${formatNumber(viewBox.minX)} ${formatNumber(viewBox.minY)} ${formatNumber(viewBox.width)} ${formatNumber(viewBox.height)}`

  const rendered = shapes.map((shape) => {
    if (shape.kind === "rect") return renderRect(shape)
    if (shape.kind === "circle") return renderCircle(shape)
    return renderPath(shape)
  })

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxAttr}" stroke="${strokeColor}" fill="${fillColor}">`,
    ...rendered.map((line) => `  ${line}`),
    `</svg>`,
  ].join("\n")
}
