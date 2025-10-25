# dsnts

`dsnts` is a TypeScript-first toolkit for reading, editing, and generating Specctra DSN (Design) and SES (Session) S-expression documents. Every DSN token is modeled as a class, so you can compose PCB designs, routing data, and component placements entirely in TypeScript and emit Specctra-compatible files with deterministic formatting.

[![npm version](https://img.shields.io/npm/v/dsnts.svg)](https://www.npmjs.com/package/dsnts)

## What is Specctra DSN?

Specctra DSN is an industry-standard file format for PCB design and autorouting. DSN files (`.dsn`) contain board structure, component placement, nets, and design rules. SES files (`.ses`) contain routing session data with wire paths and via placements. These files are commonly used by:

- **FreeRouting** - Open-source autorouter
- **KiCad** - Exports DSN files for external routing
- **Altium Designer** - Supports DSN import/export
- **Commercial autorouters** - Specctra, TopoR, etc.

## Local Setup

This repository uses [Bun](https://bun.sh) for scripts and testing.

- `bun install`
- `bun test` — optional, but handy to confirm we still round-trip DSN demo files

## Status

⚠️ **Work in Progress**: This project is currently being converted from `kicadts` to `dsnts`. Core DSN parsing and generation functionality is under active development. See [TODO.md](./TODO.md) for the implementation roadmap.

## Planned Features

### Load Existing DSN Files

Use the specialized parse functions to load and validate DSN or SES files:

```ts
import { promises as fs } from "node:fs"
import { parseSpectraDsn, parseSpectraSes } from "dsnts"

// Load and modify a DSN file
const dsn = parseSpectraDsn(await fs.readFile("board.dsn", "utf8"))
dsn.parser = "dsnts"
await fs.writeFile("board.dsn", dsn.getString())

// Load a routing session file
const ses = parseSpectraSes(await fs.readFile("board.ses", "utf8"))
console.log(`Found ${ses.routes?.length || 0} routes`)
```

### Build DSN Files Programmatically

Compose DSN files with structure, placement, library, network, and wiring sections:

```ts
import { promises as fs } from "node:fs"
import {
  SpectraDsn,
  Structure,
  Boundary,
  Network,
  Net,
  Library,
  Padstack,
} from "dsnts"

const dsn = new SpectraDsn({
  parser: "dsnts",
  resolution: { unit: "mil", value: 10 },
  structure: new Structure({
    boundary: new Boundary({
      // Board outline
      path: [[0, 0], [100, 0], [100, 80], [0, 80], [0, 0]],
    }),
  }),
  network: new Network({
    nets: [
      new Net({ name: "GND", pins: ["U1-1", "R1-1"] }),
      new Net({ name: "VCC", pins: ["U1-2", "C1-1"] }),
    ],
  }),
})

await fs.writeFile("board.dsn", dsn.getString())
```

### Extract Routing Information

Parse SES files to analyze routing results:

```ts
import { promises as fs } from "node:fs"
import { parseSpectraSes } from "dsnts"

const ses = parseSpectraSes(await fs.readFile("board.ses", "utf8"))

// Analyze wire segments
for (const wire of ses.wiring?.wires || []) {
  console.log(`Net: ${wire.net}, Layer: ${wire.layer}`)
  console.log(`Path: ${wire.path.join(" -> ")}`)
}

// Analyze vias
for (const via of ses.wiring?.vias || []) {
  console.log(`Via at ${via.position}, Padstack: ${via.padstack}`)
}
```

## Architecture

`dsnts` follows the same proven architecture as `kicadts`:

- **S-expression base classes** - `SxClass` handles parsing and serialization
- **Token-based class system** - Each DSN element (pcb, structure, network, etc.) is a class
- **Type-safe constructors** - Full TypeScript support with getters/setters
- **Round-trip testing** - Output matches input formatting exactly
- **Flexible syntax** - Use objects, arrays, or class instances in constructors

For generic S-expression parsing, use `parseSpectraSexpr` which returns an array of `SxClass` instances. Any class exposes `getChildren()` if you need to walk the tree manually.

## Resources

- [Specctra DSN Specification (PDF)](https://cdn.hackaday.io/files/1666717130852064/specctra.pdf)
- [FreeRouting Project](https://github.com/freerouting/freerouting) - Open-source autorouter
- [KiCad DSN Export](https://docs.kicad.org/master/en/pcbnew/pcbnew.html#_exporters) - How KiCad generates DSN files
- [Layout Editor DSN Format](https://layouteditor.org/layout/file-formats/dsn) - Format overview

## Contributing

This project is under active development. Check [TODO.md](./TODO.md) for the current implementation status and roadmap. Contributions are welcome!

## License

See [LICENSE](./LICENSE) file for details.
