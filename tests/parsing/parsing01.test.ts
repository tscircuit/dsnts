import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, test } from "bun:test"
import { parseSpectraDsn } from "lib/sexpr"

describe("DSN Parsing - Real World Files", () => {
  test("can parse empty_board.dsn", async () => {
    const dsnPath = resolve("demos/empty_board.dsn")
    const content = await readFile(dsnPath, "utf-8")

    const dsn = parseSpectraDsn(content)

    expect(dsn).toBeDefined()
    expect(dsn.designName).toBe("freerouting-empty.dsn")
    expect(dsn.unit).toBe("um")
    expect(dsn.structure).toBeDefined()
  })

  test("can parse Issue270-non-ansi_bracket.dsn with uppercase PCB token", async () => {
    const dsnPath = resolve("demos/Issue270-non-ansi_bracket.dsn")
    const content = await readFile(dsnPath, "utf-8")

    const dsn = parseSpectraDsn(content)

    expect(dsn).toBeDefined()
    expect(dsn.designName).toBe("untitled.brd")
    expect(dsn.unit).toBe("mil")
  })

  test("can parse Issue313-FastTest.dsn", async () => {
    const dsnPath = resolve("demos/Issue313-FastTest.dsn")
    const content = await readFile(dsnPath, "utf-8")

    const dsn = parseSpectraDsn(content)

    expect(dsn).toBeDefined()
  })
})
