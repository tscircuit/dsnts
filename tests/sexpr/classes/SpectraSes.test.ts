import { describe, expect, test } from "bun:test"
import * as fs from "fs"
import * as path from "path"
import {
  parseSpectraSes,
  SpectraSes,
  SesBaseDesign,
  SesPlacement,
  SesWasIs,
  SesRoutes,
  SesPath,
} from "lib/sexpr"

describe("SpectraSes", () => {
  test("can be constructed programmatically", () => {
    const ses = new SpectraSes({
      sessionName: "test_session",
      baseDesign: new SesBaseDesign("test_board.dsn"),
    })

    expect(ses.sessionName).toBe("test_session")
    expect(ses.baseDesign).toBeInstanceOf(SesBaseDesign)
    expect(ses.baseDesign?.designName).toBe("test_board.dsn")
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
    const ses = new SpectraSes({
      sessionName: "session1",
    })

    expect(ses.otherChildren).toHaveLength(0)
  })

  test("can parse base_design from SES file", () => {
    const input = `(session "test"
      (base_design "test.dsn")
    )`

    const parsed = parseSpectraSes(input)
    expect(parsed.baseDesign).toBeInstanceOf(SesBaseDesign)
    expect(parsed.baseDesign?.designName).toBe("test.dsn")
  })

  test("can parse placement from SES file", () => {
    const input = `(session "test"
      (placement
        (resolution mil 1000)
        (component u1
          (place u1 0 0 front 0)
        )
      )
    )`

    const parsed = parseSpectraSes(input)
    const placement = parsed.placement!
    expect(placement).toBeInstanceOf(SesPlacement)
    expect(placement.resolution?.unit).toBe("mil")
    expect(placement.resolution?.value).toBe(1000)
    expect(placement.components).toHaveLength(1)
    expect(placement.components[0]!.imageId).toBe("u1")
  })

  test("can parse was_is from SES file", () => {
    const input = `(session "test"
      (was_is
      )
    )`

    const parsed = parseSpectraSes(input)
    expect(parsed.wasIs).toBeInstanceOf(SesWasIs)
  })

  test("can parse routes from SES file", () => {
    const input = `(session "test"
      (routes
        (resolution mil 1000)
        (parser
        )
        (library_out
          (padstack via0
            (shape
              (circle 1 3024 0 0)
            )
          )
        )
        (network_out
          (net VCC
            (wire
              (path 2 1772 45016 -138866 19999 -113849)
            )
            (via via0 29574 -111576)
          )
        )
      )
    )`

    const parsed = parseSpectraSes(input)
    const routes = parsed.routes!
    expect(routes).toBeInstanceOf(SesRoutes)
    expect(routes.resolution?.unit).toBe("mil")
    expect(routes.parser).toBeDefined()
    expect(routes.libraryOut?.padstacks).toHaveLength(1)
    expect(routes.libraryOut!.padstacks[0]!.padstackId).toBe("via0")
    expect(routes.networkOut?.nets).toHaveLength(1)
    expect(routes.networkOut!.nets[0]!.netName).toBe("VCC")
    expect(routes.networkOut!.nets[0]!.wires).toHaveLength(1)
    expect(routes.networkOut!.nets[0]!.vias).toHaveLength(1)
  })

  test("can parse Example.ses file", () => {
    const sesPath = path.join(__dirname, "../../assets/Example.ses")
    const sesContent = fs.readFileSync(sesPath, "utf-8")

    const parsed = parseSpectraSes(sesContent)

    // Verify session name
    expect(parsed.sessionName).toBe("Issue313-FastTest.ses")

    // Verify base_design
    expect(parsed.baseDesign).toBeInstanceOf(SesBaseDesign)
    expect(parsed.baseDesign?.designName).toBe("Issue313-FastTest.dsn")

    // Verify placement
    const placement = parsed.placement!
    expect(placement).toBeInstanceOf(SesPlacement)
    expect(placement.resolution?.unit).toBe("mil")
    expect(placement.resolution?.value).toBe(1000)
    expect(placement.components).toHaveLength(1)
    expect(placement.components[0]!.imageId).toBe("u1")
    expect(placement.components[0]!.places).toHaveLength(1)
    expect(placement.components[0]!.places[0]!.componentRef).toBe("u1")
    expect(placement.components[0]!.places[0]!.x).toBe(0)
    expect(placement.components[0]!.places[0]!.y).toBe(0)
    expect(placement.components[0]!.places[0]!.side).toBe("front")
    expect(placement.components[0]!.places[0]!.rotation).toBe(0)

    // Verify was_is
    expect(parsed.wasIs).toBeInstanceOf(SesWasIs)

    // Verify routes
    const routes = parsed.routes!
    expect(routes).toBeInstanceOf(SesRoutes)
    expect(routes.resolution?.unit).toBe("mil")
    expect(routes.resolution?.value).toBe(1000)

    // Verify library_out has padstacks
    expect(routes.libraryOut).toBeDefined()
    const padstacks = routes.libraryOut?.padstacks ?? []
    expect(padstacks.length).toBeGreaterThan(0)
    expect(padstacks[0]!.padstackId).toBe("via0")

    // Verify network_out has nets with wires and vias
    expect(routes.networkOut).toBeDefined()
    const nets = routes.networkOut?.nets ?? []
    expect(nets.length).toBeGreaterThan(0)

    // Find VCC net
    const vccNet = nets.find((n) => n.netName === "VCC")!
    expect(vccNet).toBeDefined()
    expect(vccNet.wires.length).toBeGreaterThan(0)

    // Verify wire has path
    const wire = vccNet.wires[0]!
    expect(wire.path).toBeInstanceOf(SesPath)
    expect(wire.path?.layer).toBe(2)
    expect(wire.path?.width).toBe(1772)
    expect(wire.path?.coordinates.length).toBeGreaterThan(0)

    // Find L5_2 net which has vias
    const l5Net = nets.find((n) => n.netName === "L5_2")!
    expect(l5Net).toBeDefined()
    expect(l5Net.vias.length).toBeGreaterThan(0)
    expect(l5Net.vias[0]!.padstackId).toBe("via0")
    expect(l5Net.vias[0]!.x).toBe(29574)
    expect(l5Net.vias[0]!.y).toBe(-111576)
  })
})
