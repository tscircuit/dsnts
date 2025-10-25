import { describe, expect, test } from "bun:test"
import { parseSpectraSes, SpectraSes } from "lib/sexpr"

describe("SpectraSes", () => {
  test("can be constructed programmatically", () => {
    const ses = new SpectraSes({
      sessionName: "test_session",
      baseDesign: "test_board.dsn",
    })

    expect(ses.sessionName).toBe("test_session")
    expect(ses.baseDesign).toBe("test_board.dsn")
  })

  test("getString() outputs correct format", () => {
    const ses = new SpectraSes({
      sessionName: "my_session",
    })

    const output = ses.getString()
    expect(output).toContain("(session")
    expect(output).toContain('"my_session"')
    expect(output).toContain(")")
  })

  test("can parse and round-trip a minimal SES file", () => {
    const input = `(session "routing_results")`

    const parsed = parseSpectraSes(input)
    expect(parsed).toBeInstanceOf(SpectraSes)
    expect(parsed.sessionName).toBe("routing_results")

    const output = parsed.getString()
    expect(output).toContain("(session")
    expect(output).toContain('"routing_results"')
  })

  test("handles empty session token", () => {
    const input = `(session)`

    const parsed = parseSpectraSes(input)
    expect(parsed).toBeInstanceOf(SpectraSes)
    expect(parsed.sessionName).toBeUndefined()
  })

  test("throws error when parsing non-SES file", () => {
    const input = `(pcb "test")`

    expect(() => parseSpectraSes(input)).toThrow(
      /Expected SpectraSes root with token "session"/,
    )
  })

  test("handles otherChildren for unimplemented SES elements", () => {
    // SES files can have many child elements that aren't implemented yet
    // They should be preserved in otherChildren
    const ses = new SpectraSes({
      sessionName: "session1",
    })

    expect(ses.otherChildren).toHaveLength(0)
  })
})
