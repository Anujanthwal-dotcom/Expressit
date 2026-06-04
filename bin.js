#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { arch, platform } from 'node:os'
import { resolve } from 'node:path'

const knownPlatforms = {
  'linux-x64': 'expressit-linux-x64',
  'linux-arm64': 'expressit-linux-arm64',
  'darwin-x64': 'expressit-darwin-x64',
  'darwin-arm64': 'expressit-darwin-arm64',
  'win32-x64': 'expressit-windows-x64',
}

const pkgKey = `${platform()}-${arch()}`
const binaryName = platform() === 'win32' ? 'expressit.exe' : 'expressit'

const require = createRequire(import.meta.url)

function getBinaryPath() {
  const pkgName = knownPlatforms[pkgKey]
  if (pkgName) {
    try {
      const pkgJsonPath = require.resolve(`${pkgName}/package.json`)
      return resolve(pkgJsonPath, '..', binaryName)
    } catch {}
  }
  return resolve(resolve(import.meta.url, '..'), 'dist', binaryName)
}

try {
  execFileSync(getBinaryPath(), process.argv.slice(2), { stdio: 'inherit' })
} catch (err) {
  process.exit(err.status ?? 1)
}
