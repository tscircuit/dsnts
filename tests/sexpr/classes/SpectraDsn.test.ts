import { describe, expect, test } from "bun:test"
import { parseSpectraDsn, SpectraDsn } from "lib/sexpr"

describe("SpectraDsn", () => {
  test("can be constructed programmatically", () => {
    const dsn = new SpectraDsn({
      designName: "test_board",
      parser: "dsnts",
      unit: "mil",
    })

    expect(dsn.designName).toBe("test_board")
    expect(dsn.parser).toBe("dsnts")
    expect(dsn.unit).toBe("mil")
  })

  test("getString() outputs correct format", () => {
    const dsn = new SpectraDsn({
      designName: "my_board",
    })

    const output = dsn.getString()
    expect(output).toContain("(pcb")
    expect(output).toContain('"my_board"')
    expect(output).toContain(")")
  })

  test("can parse and round-trip a minimal DSN file", () => {
    const input = `(pcb "test_design")`

    const parsed = parseSpectraDsn(input)
    expect(parsed).toBeInstanceOf(SpectraDsn)
    expect(parsed.designName).toBe("test_design")

    const output = parsed.getString()
    expect(output).toContain("(pcb")
    expect(output).toContain('"test_design"')
  })

  test("handles empty pcb token", () => {
    const input = `(pcb)`

    const parsed = parseSpectraDsn(input)
    expect(parsed).toBeInstanceOf(SpectraDsn)
    expect(parsed.designName).toBeUndefined()
  })

  test("throws error when parsing non-DSN file", () => {
    const input = `(session "test")`

    expect(() => parseSpectraDsn(input)).toThrow(
      /Expected SpectraDsn root with token "pcb"/,
    )
  })

  test("handles otherChildren for unimplemented DSN elements", () => {
    // DSN files can have many child elements that aren't implemented yet
    // They should be preserved in otherChildren
    const dsn = new SpectraDsn({
      designName: "board",
    })

    expect(dsn.otherChildren).toHaveLength(0)
  })
})
