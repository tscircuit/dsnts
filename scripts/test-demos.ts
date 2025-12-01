import { readFile, readdir } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parseSpectraDsn } from "../lib/sexpr"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const demosDir = resolve(repoRoot, "demos")

async function testDemoFile(filename: string): Promise<void> {
  console.log(`\n${"=".repeat(60)}`)
  console.log(`Testing: ${filename}`)
  console.log("=".repeat(60))

  const filePath = resolve(demosDir, filename)

  try {
    const content = await readFile(filePath, "utf-8")
    console.log(`File size: ${(content.length / 1024).toFixed(2)} KB`)

    const startTime = performance.now()
    const dsn = parseSpectraDsn(content)
    const parseTime = performance.now() - startTime

    console.log(`Parse time: ${parseTime.toFixed(2)}ms`)
    console.log(`Design name: ${dsn.designName ?? "(none)"}`)
    console.log(`Parser: ${dsn.parser ?? "(none)"}`)
    console.log(`Unit: ${dsn.unit ?? "(none)"}`)
    console.log(`Resolution: ${dsn.resolution ? "present" : "not present"}`)
    console.log(`Structure: ${dsn.structure ? "present" : "not present"}`)
    console.log(`Placement: ${dsn.placement ? "present" : "not present"}`)
    console.log(`Library: ${dsn.library ? "present" : "not present"}`)
    console.log(`Network: ${dsn.network ? "present" : "not present"}`)
    console.log(`Wiring: ${dsn.wiring ? "present" : "not present"}`)
    console.log(`Other children: ${dsn.otherChildren.length}`)

    console.log("\nStatus: SUCCESS")
  } catch (error) {
    console.error(`\nStatus: FAILED`)
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    )
    if (error instanceof Error && error.stack) {
      console.error(`\nStack trace (first 5 lines):`)
      const stackLines = error.stack.split("\n").slice(0, 5)
      console.error(stackLines.join("\n"))
    }
  }
}

async function main(): Promise<void> {
  console.log("Testing DSN demo files...")

  const files = await readdir(demosDir)
  const dsnFiles = files.filter((f) => f.endsWith(".dsn")).sort()

  console.log(`Found ${dsnFiles.length} DSN files`)

  let successCount = 0
  let failCount = 0

  for (const file of dsnFiles) {
    try {
      await testDemoFile(file)
      successCount++
    } catch (error) {
      failCount++
      console.error(`Unexpected error testing ${file}:`, error)
    }
  }

  console.log(`\n${"=".repeat(60)}`)
  console.log("SUMMARY")
  console.log("=".repeat(60))
  console.log(`Total files: ${dsnFiles.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Failed: ${failCount}`)
}

await main()
