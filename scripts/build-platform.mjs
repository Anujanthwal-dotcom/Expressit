import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { arch, platform } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const targets = {
  'linux-x64': { os: 'linux', arch: 'x64' },
  'linux-arm64': { os: 'linux', arch: 'arm64' },
  'darwin-x64': { os: 'darwin', arch: 'x64' },
  'darwin-arm64': { os: 'darwin', arch: 'arm64' },
  'win32-x64': { os: 'win32', arch: 'x64' },
}

const pkgJson = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'))

const override = process.argv[2]
const targetKey = override || `${platform()}-${arch()}`
const target = targets[targetKey]

if (!target) throw new Error(`Unsupported platform: ${targetKey}`)

const binaryName = target.os === 'win32' ? 'expressit.exe' : 'expressit'
const outDir = resolve(__dirname, '..', 'platform-packages', targetKey)

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const outfile = resolve(outDir, binaryName.replace(/\.exe$/, ''))
execSync(`bun build --compile src/index.ts --outfile "${outfile}"`, {
  stdio: 'inherit',
  cwd: resolve(__dirname, '..'),
})

writeFileSync(
  resolve(outDir, 'package.json'),
  `${JSON.stringify(
    {
      name: `create-expressit-${targetKey}`,
      version: pkgJson.version,
      private: false,
      os: [target.os],
      cpu: [target.arch],
      files: [binaryName],
    },
    null,
    2,
  )}\n`,
)

console.log(`Platform package created at ${outDir}`)
