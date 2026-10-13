#!/usr/bin/env node
/**
 * Franchise web coverage gate (inventory average).
 *
 * For each parent-repo source that already has a test, score:
 *   (statements% + branches% + functions% + lines%) / 4
 *
 * Gate average = unweighted mean of those per-file scores.
 * Untested modules and src/@/components are not in the denominator.
 *
 * Usage:
 *   pnpm test:coverage:summary
 *   node scripts/coverage-summary.js --no-run [--strict] [--json]
 */
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const coverageFile = path.join(root, 'coverage', 'coverage-final.json')
const gateJsonFile = path.join(root, 'coverage', 'gate-summary.json')

const args = new Set(process.argv.slice(2))
const runCoverage = !args.has('--no-run')

if (runCoverage) {
  const result = spawnSync('pnpm', ['exec', 'vitest', '--coverage', '--run'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

if (!fs.existsSync(coverageFile)) {
  console.error(`Coverage file not found: ${coverageFile}`)
  console.error('Run `pnpm test:coverage` first, or omit --no-run.')
  process.exit(1)
}

const walkTestFiles = (dir, acc = []) => {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'coverage' || entry.name === 'dist') continue
    if (entry.name === '@' && path.basename(dir) === 'src') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkTestFiles(full, acc)
      continue
    }
    if (!/\.(test|spec)\.(js|jsx)$/.test(entry.name)) continue
    acc.push(full)
  }
  return acc
}

const sourceForTest = (testPath) => {
  const testDir = path.dirname(testPath)
  const base = path.basename(testPath).replace(/\.(test|spec)\.(js|jsx)$/, '')
  const searchDir = path.basename(testDir) === '__tests__' ? path.dirname(testDir) : testDir
  const candidates = [
    path.join(searchDir, `${base}.js`),
    path.join(searchDir, `${base}.jsx`),
    path.join(searchDir, 'index.js'),
    path.join(searchDir, 'index.jsx')
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

const pct = (covered, total) => (total > 0 ? (covered / total) * 100 : 0)

const fileScore = (fileData) => {
  let statementsTotal = 0
  let statementsCovered = 0
  let branchesTotal = 0
  let branchesCovered = 0
  let functionsTotal = 0
  let functionsCovered = 0
  let linesTotal = 0
  let linesCovered = 0

  if (fileData?.s) {
    Object.values(fileData.s).forEach((v) => {
      statementsTotal++
      if (v > 0) statementsCovered++
    })
  }
  if (fileData?.b) {
    Object.values(fileData.b).forEach((branch) => {
      branchesTotal += branch.length
      branchesCovered += branch.filter((v) => v > 0).length
    })
  }
  if (fileData?.f) {
    Object.values(fileData.f).forEach((v) => {
      functionsTotal++
      if (v > 0) functionsCovered++
    })
  }
  if (fileData?.l) {
    Object.values(fileData.l).forEach((v) => {
      linesTotal++
      if (v > 0) linesCovered++
    })
  } else if (fileData?.s) {
    Object.values(fileData.s).forEach((v) => {
      linesTotal++
      if (v > 0) linesCovered++
    })
  }

  const statements = pct(statementsCovered, statementsTotal)
  const branches = pct(branchesCovered, branchesTotal)
  const functions = pct(functionsCovered, functionsTotal)
  const lines = pct(linesCovered, linesTotal)
  const hasAny = statementsTotal + branchesTotal + functionsTotal + linesTotal > 0
  const average = hasAny ? (statements + branches + functions + lines) / 4 : 0

  return { statements, branches, functions, lines, average, hasAny }
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
const coverageByAbs = new Map()
Object.entries(coverageData).forEach(([filePath, fileData]) => {
  coverageByAbs.set(path.resolve(filePath), fileData)
})

const testFiles = [
  ...walkTestFiles(path.join(root, 'src')),
  ...walkTestFiles(path.join(root, 'worker'))
]
const inventory = []

for (const testPath of testFiles) {
  const sourcePath = sourceForTest(testPath)
  if (!sourcePath) continue
  const score = fileScore(coverageByAbs.get(path.resolve(sourcePath)) || {})
  inventory.push({
    test: path.relative(root, testPath),
    source: path.relative(root, sourcePath),
    ...score
  })
}

const bySource = new Map()
inventory.forEach((row) => {
  const prev = bySource.get(row.source)
  if (!prev || row.average > prev.average) bySource.set(row.source, row)
})
const rows = [...bySource.values()].sort((a, b) => a.source.localeCompare(b.source))

const round = (n) => Math.round(n * 100) / 100
const round0 = (n) => Math.round(n)
const mean = (key) => (
  rows.length
    ? rows.reduce((sum, row) => sum + row[key], 0) / rows.length
    : 0
)

const statements = mean('statements')
const branches = mean('branches')
const functions = mean('functions')
const lines = mean('lines')
const average = (statements + branches + functions + lines) / 4

const summary = {
  formula: 'inventory-file-average',
  description: 'Unweighted mean of per-file metrics for parent sources that already have a test',
  threshold: 70,
  inventoryCount: rows.length,
  statements: round(statements),
  branches: round(branches),
  functions: round(functions),
  lines: round(lines),
  average: round(average),
  rounded: {
    statements: round0(statements),
    branches: round0(branches),
    functions: round0(functions),
    lines: round0(lines)
  },
  meetsGate: average >= 70,
  files: rows.map((row) => ({
    source: row.source,
    test: row.test,
    average: round(row.average)
  }))
}

fs.mkdirSync(path.dirname(gateJsonFile), { recursive: true })
fs.writeFileSync(gateJsonFile, `${JSON.stringify(summary, null, 2)}\n`)

console.log('')
console.log('Coverage summary (inventory average)')
console.log('------------------------------------')
console.log(`Inventory  : ${summary.inventoryCount} source file(s) with tests`)
console.log(`Statements : ${summary.statements}%`)
console.log(`Branches   : ${summary.branches}%`)
console.log(`Functions  : ${summary.functions}%`)
console.log(`Lines      : ${summary.lines}%`)
console.log(`Average    : ${summary.average}%  (threshold: 70%)`)
console.log('')
console.log(summary.meetsGate ? '✅ Meets 70% gate' : '❌ Below 70% gate')

if (args.has('--json')) {
  console.log(JSON.stringify(summary))
}

if (args.has('--strict') && !summary.meetsGate) {
  process.exit(1)
}
