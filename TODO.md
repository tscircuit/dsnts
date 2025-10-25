# TODO: Adapt kicadts to dsnts (Specctra DSN Parser)

This document outlines the plan to adapt the current kicadts repository to parse Specctra DSN (and SES) files instead of KiCad files, while maintaining the same general code patterns and architecture.

## Architecture Overview

The current architecture uses:
- **S-expression base classes** (`SxClass`, primitive types) - ✅ Can be reused as-is
- **Token-based class system** - Each DSN element is modeled as a class with a token
- **Parsing infrastructure** - `parseToPrimitiveSExpr` and class registration system
- **Type-safe constructors** - With getters/setters for properties
- **Round-trip testing** - Ensures output matches input formatting

## Phase 1: Repository Rebranding & Setup

### 1.1 Package Configuration
- [ ] Update `package.json`:
  - [ ] Change `name` from `"kicadts"` to `"dsnts"`
  - [ ] Update repository URL to new repo location
  - [ ] Update description to reference Specctra DSN files
  - [ ] Update version to `0.1.0` (fresh start)
- [ ] Update `README.md`:
  - [ ] Replace all KiCad references with Specctra DSN
  - [ ] Rewrite examples to show DSN file usage
  - [ ] Update API documentation for DSN-specific classes
  - [ ] Add information about Specctra DSN file format
  - [ ] Add links to Specctra specification documents

### 1.2 Build & Development Scripts
- [ ] Update `scripts/download-references.ts`:
  - [ ] Remove KiCad demo download logic
  - [ ] Add logic to download sample DSN files (from FreeRouting examples, etc.)
- [ ] Update `package.json` scripts:
  - [ ] Rename `download-demos` to reference DSN sample files
  - [ ] Update any KiCad-specific script references

## Phase 2: Core Architecture - Root Classes

### 2.1 Main DSN File Class
- [ ] Create `SpectraDsn` class (replaces `KicadPcb`):
  - [ ] Token: `"pcb"` (DSN files start with `(pcb ...)`)
  - [ ] Properties: parser, resolution, unit, structure, placement, library, network, wiring, etc.
  - [ ] Follow same pattern as `KicadPcb.ts` for constructor and getters/setters
  - [ ] Location: `lib/sexpr/classes/SpectraDsn.ts`

### 2.2 Session (SES) File Class
- [ ] Create `SpectraSes` class (for session files):
  - [ ] Token: `"session"` (SES files start with `(session ...)`)
  - [ ] Properties: base_design, placement, was_is, routes, etc.
  - [ ] Location: `lib/sexpr/classes/SpectraSes.ts`

### 2.3 Remove KiCad-Specific Root Classes
- [ ] Delete or deprecate:
  - [ ] `KicadSch.ts` (DSN doesn't have schematics)
  - [ ] `KicadPcb.ts` (replaced by SpectraDsn)
  - [ ] `KicadSchGenerator.ts`, `KicadSchVersion.ts`, etc.

## Phase 3: DSN Structure Classes

### 3.1 Top-Level DSN Components
- [ ] Create `Parser` class - `(parser ...)`
- [ ] Create `Resolution` class - `(resolution ...)`
- [ ] Create `Unit` class - `(unit ...)`
- [ ] Create `Structure` class - `(structure ...)`
  - [ ] Child: `Boundary` - `(boundary ...)`
  - [ ] Child: `Via` - `(via ...)` (different from KiCad via)
  - [ ] Child: `Rule` - `(rule ...)`
  - [ ] Child: `Keepout` - `(keepout ...)`
- [ ] Create `Placement` class - `(placement ...)`
  - [ ] Child: `Component` - `(component ...)`
  - [ ] Child: `PlaceComponent` - `(place ...)`
- [ ] Create `Library` class - `(library ...)`
  - [ ] Child: `Image` - `(image ...)` (footprint definition)
  - [ ] Child: `Padstack` - `(padstack ...)`
- [ ] Create `Network` class - `(network ...)`
  - [ ] Child: `Net` - `(net ...)`
  - [ ] Child: `NetClass` - `(class ...)`
  - [ ] Child: `NetPin` - `(pin ...)`
- [ ] Create `Wiring` class - `(wiring ...)`
  - [ ] Child: `Wire` - `(wire ...)` (different from KiCad wire)
  - [ ] Child: `WirePath` - `(path ...)`
  - [ ] Child: `WireVia` - `(via ...)`

### 3.2 Geometry & Design Rule Classes
- [ ] Create `Rule` class hierarchy:
  - [ ] `WidthRule` - `(width ...)`
  - [ ] `ClearanceRule` - `(clearance ...)`
  - [ ] `CircleDescriptor` - `(circle ...)`
  - [ ] `PathDescriptor` - `(path ...)`
  - [ ] `PolygonDescriptor` - `(polygon ...)`
  - [ ] `RectDescriptor` - `(rect ...)`
- [ ] Create coordinate classes:
  - [ ] `Coordinate` - Generic coordinate handling
  - [ ] May be able to reuse `At`, `Xy`, `Pts` with modifications

### 3.3 Layer System
- [ ] Create DSN-specific layer classes:
  - [ ] `DsnLayer` class - `(layer ...)` (different structure than KiCad)
  - [ ] `LayerPair` - `(layer_pair ...)`
  - [ ] Update or create `DsnLayers` (collection class)
- [ ] Remove KiCad layer-specific classes:
  - [ ] `PcbLayers.ts`, `PcbLayerDefinition.ts` (KiCad-specific)

## Phase 4: Component & Footprint Classes

### 4.1 DSN Component System
- [ ] Create `DsnComponent` class - `(component ...)`
  - [ ] Properties: image reference, placement info
  - [ ] Different from KiCad `Footprint` structure
- [ ] Create `DsnImage` class - `(image ...)`
  - [ ] Replaces KiCad `Footprint` for library definitions
  - [ ] Contains outline, pins, keepouts
- [ ] Create `Padstack` class - `(padstack ...)`
  - [ ] Defines pad shapes for different layers
  - [ ] More complex than KiCad pad definitions

### 4.2 Remove KiCad Footprint Classes
- [ ] Delete/archive these KiCad-specific classes:
  - [ ] `Footprint.ts` and all `Footprint*` classes (~25 files)
  - [ ] `FootprintPad.ts` and all `Pad*` classes (~25 files)
  - [ ] `FpText.ts`, `FpTextBox.ts`, `FpLine.ts`, `FpRect.ts`, `FpCircle.ts`, `FpArc.ts`, `FpPoly.ts`, etc. (~10 files)

## Phase 5: Nets & Routing Classes

### 5.1 Network System
- [ ] Create `DsnNet` class - `(net ...)` in network section
  - [ ] Different structure than KiCad `PcbNet`
  - [ ] Contains pins, class assignments
- [ ] Create `NetClass` class - `(class ...)`
  - [ ] Groups nets with similar rules
- [ ] Create `Pin` class - `(pin ...)`
  - [ ] References component pins in nets

### 5.2 Wiring & Routing
- [ ] Create `DsnWire` class - `(wire ...)`
  - [ ] Different from schematic `Wire`
  - [ ] Contains routing information
- [ ] Create `Path` class - `(path ...)`
  - [ ] Route geometry
- [ ] Create `DsnVia` class - `(via ...)`
  - [ ] Simpler than KiCad via structure

### 5.3 Remove KiCad Routing Classes
- [ ] Delete/archive:
  - [ ] `Segment.ts`, `SegmentStart.ts`, `SegmentEnd.ts`, etc.
  - [ ] `Zone.ts` (no zone concept in DSN)
  - [ ] KiCad-specific `Via.ts`

## Phase 6: Graphics & Design Elements

### 6.1 DSN Graphics
- [ ] Create boundary/outline classes:
  - [ ] `Outline` - `(outline ...)`
  - [ ] `Window` - `(window ...)` (cutouts)
- [ ] Adapt or create shape classes:
  - [ ] `Circle`, `Path`, `Polygon`, `Rectangle`
  - [ ] May be able to reuse some existing shape classes with modifications

### 6.2 Remove KiCad Graphics
- [ ] Delete/archive:
  - [ ] `GrLine.ts`, `GrText.ts` and related classes
  - [ ] KiCad-specific drawing primitives

## Phase 7: Common/Reusable Classes

### 7.1 Keep & Adapt
- [ ] Review and keep these (with possible modifications):
  - [ ] `At.ts` - Position/rotation (may need DSN-specific format)
  - [ ] `Xy.ts` - Coordinate pairs
  - [ ] `Pts.ts` - Point lists
  - [ ] `Color.ts` - Color definitions (if used in DSN)
  - [ ] `Stroke.ts`, `Width.ts` - Line styling
  - [ ] `Layer.ts` - May need modification for DSN layer format

### 7.2 Remove KiCad-Specific
- [ ] Delete/archive:
  - [ ] `Paper.ts`, `TitleBlock.ts` (schematic-specific)
  - [ ] `Property.ts`, `PropertyUnlocked.ts`, `PropertyHide.ts` (KiCad-specific)
  - [ ] `Sheet.ts`, `SheetPin.ts`, etc. (schematic-specific)
  - [ ] `Symbol.ts`, `LibSymbols.ts` (schematic-specific)
  - [ ] `Bus.ts`, `BusEntry.ts`, `Junction.ts`, `NoConnect.ts`, `Label.ts`, `GlobalLabel.ts` (schematic-specific)
  - [ ] `SchematicText.ts`
  - [ ] `Setup.ts` (KiCad PCB setup - different in DSN)
  - [ ] `PcbGeneral.ts`, `PcbGeneralThickness.ts`, etc.
  - [ ] `EmbeddedFonts.ts`, `FieldsAutoplaced.ts`, `ExcludeFromSim.ts`, `Dnp.ts`, `InBom.ts`, `OnBoard.ts`

## Phase 8: Parsing Infrastructure

### 8.1 Update Parse Functions
- [ ] Update `parseKicadSexpr.ts` → `parseSpectraSexpr.ts`:
  - [ ] Rename `parseKicadSexpr` → `parseSpectraSexpr`
  - [ ] Create `parseSpectraDsn` (returns `SpectraDsn`)
  - [ ] Create `parseSpectraSes` (returns `SpectraSes`)
  - [ ] Remove `parseKicadSch`, `parseKicadPcb`, `parseKicadMod`

### 8.2 Keep Core Parsing
- [ ] Keep `parseToPrimitiveSExpr.ts` as-is (handles S-expression parsing)
- [ ] Keep `SxClass.ts` base class system
- [ ] Keep primitive classes (`SxPrimitiveBoolean`, `SxPrimitiveNumber`, `SxPrimitiveString`)

## Phase 9: Update Exports

### 9.1 Main Index
- [ ] Update `lib/index.ts`:
  - [ ] Export only `sexpr` (same pattern)
- [ ] Update `lib/sexpr/index.ts`:
  - [ ] Remove all KiCad class exports
  - [ ] Add all DSN class exports
  - [ ] Export `parseSpectraSexpr`, `parseSpectraDsn`, `parseSpectraSes`
  - [ ] Keep base class exports

## Phase 10: Testing Infrastructure

### 10.1 Update Test Fixtures
- [ ] Update `tests/fixtures/`:
  - [ ] Keep `expectEqualPrimitiveSExpr.ts` (works for any S-expression)
  - [ ] Review `png-matcher.ts` (may not be needed for DSN)
  - [ ] Keep `preload.ts`

### 10.2 Create DSN Tests
- [ ] Create `tests/sexpr/SpectraDsnDemos.test.ts`:
  - [ ] Download sample DSN files
  - [ ] Test round-trip parsing (parse → stringify → parse)
  - [ ] Follow pattern from `KicadPcbDemos.test.ts`
- [ ] Create `tests/sexpr/SpectraSesDemos.test.ts`:
  - [ ] Test SES file round-tripping
- [ ] Create unit tests for major DSN classes:
  - [ ] `tests/sexpr/classes/SpectraDsn.test.ts`
  - [ ] `tests/sexpr/classes/Structure.test.ts`
  - [ ] `tests/sexpr/classes/Network.test.ts`
  - [ ] `tests/sexpr/classes/Library.test.ts`
  - [ ] `tests/sexpr/classes/Wiring.test.ts`

### 10.3 Remove KiCad Tests
- [ ] Delete:
  - [ ] `KicadSchDemos.test.ts`
  - [ ] `KicadPcbDemos.test.ts`
  - [ ] All `tests/sexpr/classes/` tests for removed classes

## Phase 11: Documentation & Examples

### 11.1 Update README Examples
- [ ] Create example: "Parse Existing DSN File"
- [ ] Create example: "Build DSN File Programmatically"
- [ ] Create example: "Extract Network Information"
- [ ] Create example: "Modify Component Placement"
- [ ] Create example: "Parse SES Session File"

### 11.2 API Documentation
- [ ] Document main classes:
  - [ ] `SpectraDsn` - Root DSN file class
  - [ ] `SpectraSes` - Session file class
  - [ ] `Structure` - Board structure
  - [ ] `Network` - Net definitions
  - [ ] `Library` - Component library
  - [ ] `Wiring` - Routing information
- [ ] Document common patterns:
  - [ ] Creating components
  - [ ] Defining nets
  - [ ] Setting up rules
  - [ ] Parsing files

## Phase 12: TypeScript & Build Configuration

### 12.1 Type Definitions
- [ ] Review and update type exports
- [ ] Ensure all new DSN classes have proper types
- [ ] Update constructor parameter interfaces

### 12.2 Build Verification
- [ ] Run `bun run typecheck` - ensure no errors
- [ ] Run `bun run build` - ensure clean build
- [ ] Run `bun test` - all new tests pass
- [ ] Run `bun run format` - code formatted

## Phase 13: Reference Implementation Research

### 13.1 Study DSN Format
- [ ] Download and study Specctra DSN specification PDF
- [ ] Analyze sample DSN files from:
  - [ ] FreeRouting examples
  - [ ] KiCad DSN exports
  - [ ] Online DSN file repositories
- [ ] Document DSN file structure and element types
- [ ] Create reference samples in `tests/fixtures/dsn-samples/`

### 13.2 Identify All DSN Tokens
- [ ] Create comprehensive list of DSN tokens/keywords
- [ ] Map tokens to class implementations needed
- [ ] Prioritize commonly-used tokens vs. rare ones

## Phase 14: Migration Cleanup

### 14.1 File Organization
- [ ] Move deprecated KiCad classes to `lib/sexpr/classes/_deprecated/` (if keeping for reference)
  - Or delete entirely if not needed
- [ ] Organize DSN classes by category:
  - [ ] `lib/sexpr/classes/structure/`
  - [ ] `lib/sexpr/classes/network/`
  - [ ] `lib/sexpr/classes/library/`
  - [ ] `lib/sexpr/classes/wiring/`
  - [ ] `lib/sexpr/classes/rules/`

### 14.2 Final Verification
- [ ] All imports updated (no broken references)
- [ ] All tests passing
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Documentation complete
- [ ] README examples work
- [ ] Package.json metadata correct

## Implementation Notes

### Code Patterns to Maintain

1. **Class Structure Pattern**:
   ```typescript
   export class DsnElement extends SxClass {
     static override token = "element_name"
     token = "element_name"

     private _property?: PropertyType

     constructor(params: DsnElementParams = {}) {
       super()
       // Initialize properties
     }

     static override fromSexprPrimitives(primitives: PrimitiveSExpr[]): DsnElement {
       // Parse from S-expression
     }

     get property(): PropertyType | undefined {
       return this._property
     }

     set property(value: PropertyType | undefined) {
       this._property = value
     }

     override getChildren(): SxClass[] {
       // Return child elements
     }
   }
   SxClass.register(DsnElement)
   ```

2. **Test Pattern**:
   ```typescript
   test("round-trip DSN file", async () => {
     const original = await Bun.file("sample.dsn").text()
     const parsed = parseSpectraDsn(original)
     const output = parsed.getString()

     const originalPrimitive = parseToPrimitiveSExpr(original)
     const outputPrimitive = parseToPrimitiveSExpr(output)

     expectEqualPrimitiveSExpr(outputPrimitive, originalPrimitive)
   })
   ```

3. **Constructor Flexibility**:
   - Support both object syntax and array syntax where appropriate
   - Allow primitive values or class instances in constructors
   - Example: `at: [10, 20, 90]` or `at: { x: 10, y: 20, angle: 90 }` or `at: new At(...)`

### Resources

- Specctra DSN Specification: [SPECCTRA Design Language Reference](https://cdn.hackaday.io/files/1666717130852064/specctra.pdf)
- FreeRouting Project: https://github.com/freerouting/freerouting
- KiCad DSN Export: Study files exported from KiCad
- DSN File Format Overview: https://layouteditor.org/layout/file-formats/dsn

## Estimated File Changes

- **Delete/Archive**: ~100-120 KiCad-specific class files
- **Create New**: ~60-80 DSN-specific class files
- **Keep/Modify**: ~10-15 common utility classes
- **Update**: All test files, README, package.json, index files

## Priority Order

1. **Critical Path** (Must do first):
   - Phase 1: Rebranding
   - Phase 2: Root classes
   - Phase 8: Parse infrastructure
   - Phase 13: Research & samples

2. **Core Implementation** (Main functionality):
   - Phase 3: Structure classes
   - Phase 4: Component system
   - Phase 5: Network & routing

3. **Polish** (Complete the package):
   - Phase 9: Exports
   - Phase 10: Testing
   - Phase 11: Documentation
   - Phase 12: Build verification
