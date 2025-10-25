import { describe, expect, test } from "bun:test"
import {
  DsnBoundary,
  DsnLibrary,
  DsnNetwork,
  DsnParser,
  DsnPlacement,
  DsnResolution,
  DsnStructure,
  DsnUnit,
  DsnWiring,
  parseSpectraDsn,
  SpectraDsn,
} from "lib/sexpr"

describe("SpectraDsn with DSN Structure Classes", () => {
  test("can create SpectraDsn with all major DSN sections", () => {
    const dsn = new SpectraDsn({
      designName: "test_board",
      parser: "dsnts",
      resolution: new DsnResolution("mil", 10),
      unit: "mil",
      structure: new DsnStructure({
        boundary: new DsnBoundary(),
      }),
      placement: new DsnPlacement(),
      library: new DsnLibrary(),
      network: new DsnNetwork(),
      wiring: new DsnWiring(),
    })

    expect(dsn.designName).toBe("test_board")
    expect(dsn.parser).toBe("dsnts")
    expect(dsn.unit).toBe("mil")
    expect(dsn.resolution).toBeInstanceOf(DsnResolution)
    expect(dsn.structure).toBeInstanceOf(DsnStructure)
    expect(dsn.placement).toBeInstanceOf(DsnPlacement)
    expect(dsn.library).toBeInstanceOf(DsnLibrary)
    expect(dsn.network).toBeInstanceOf(DsnNetwork)
    expect(dsn.wiring).toBeInstanceOf(DsnWiring)
  })

  test("getString() outputs valid DSN format", () => {
    const dsn = new SpectraDsn({
      designName: "board1",
      parser: "dsnts",
      resolution: new DsnResolution("mil", 10),
      unit: "mil",
    })

    const output = dsn.getString()
    expect(output).toContain("(pcb")
    expect(output).toContain('"board1"')
    expect(output).toContain("(parser dsnts)")
    expect(output).toContain("(resolution mil 10)")
    expect(output).toContain("(unit mil)")
  })

  test("can parse DSN file with parser token", () => {
    const input = `(pcb "test"
  (parser "Specctra_DSN")
)`

    const parsed = parseSpectraDsn(input)
    expect(parsed.designName).toBe("test")
    expect(parsed.parser).toBe("Specctra_DSN")
  })

  test("can parse DSN file with resolution", () => {
    const input = `(pcb "test"
  (resolution mil 10)
)`

    const parsed = parseSpectraDsn(input)
    expect(parsed.resolution).toBeInstanceOf(DsnResolution)
    expect(parsed.resolution?.unit).toBe("mil")
    expect(parsed.resolution?.value).toBe(10)
  })

  test("can parse DSN file with unit", () => {
    const input = `(pcb "test"
  (unit mm)
)`

    const parsed = parseSpectraDsn(input)
    expect(parsed.unit).toBe("mm")
  })

  test("can parse DSN file with structure section", () => {
    const input = `(pcb "test"
  (structure
    (boundary
    )
  )
)`

    const parsed = parseSpectraDsn(input)
    expect(parsed.structure).toBeInstanceOf(DsnStructure)
    expect(parsed.structure?.boundary).toBeInstanceOf(DsnBoundary)
  })

  test("can parse DSN file with all major sections", () => {
    const input = `(pcb "complete_board"
  (parser dsnts)
  (resolution mil 10)
  (unit mil)
  (structure
    (boundary)
  )
  (placement)
  (library)
  (network)
  (wiring)
)`

    const parsed = parseSpectraDsn(input)
    expect(parsed.designName).toBe("complete_board")
    expect(parsed.parser).toBe("dsnts")
    expect(parsed.structure).toBeInstanceOf(DsnStructure)
    expect(parsed.placement).toBeInstanceOf(DsnPlacement)
    expect(parsed.library).toBeInstanceOf(DsnLibrary)
    expect(parsed.network).toBeInstanceOf(DsnNetwork)
    expect(parsed.wiring).toBeInstanceOf(DsnWiring)
  })

  test("round-trip parsing preserves structure", () => {
    const original = new SpectraDsn({
      designName: "roundtrip_test",
      parser: "dsnts",
      unit: "mil",
    })

    const serialized = original.getString()
    const parsed = parseSpectraDsn(serialized)

    expect(parsed.designName).toBe("roundtrip_test")
    expect(parsed.parser).toBe("dsnts")
    expect(parsed.unit).toBe("mil")
  })

  test("DsnResolution handles different units", () => {
    const milRes = new DsnResolution("mil", 10)
    expect(milRes.unit).toBe("mil")
    expect(milRes.value).toBe(10)
    expect(milRes.getString()).toBe("(resolution mil 10)")

    const mmRes = new DsnResolution("mm", 100000)
    expect(mmRes.unit).toBe("mm")
    expect(mmRes.value).toBe(100000)
    expect(mmRes.getString()).toBe("(resolution mm 100000)")
  })

  test("structure accepts boundary", () => {
    const structure = new DsnStructure({
      boundary: new DsnBoundary(),
    })

    expect(structure.boundary).toBeInstanceOf(DsnBoundary)
    const output = structure.getString()
    expect(output).toContain("(structure")
    expect(output).toContain("(boundary")
  })
})
