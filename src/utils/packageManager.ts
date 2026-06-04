import { spawn } from 'node:child_process'
import type { PackageManager } from '../types.js'

const COMMANDS: Record<PackageManager, string> = {
  npm: 'npm',
  pnpm: 'pnpm',
  yarn: 'yarn',
  bun: 'bun',
}

export function installDependencies(projectPath: string, packageManager: PackageManager): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = COMMANDS[packageManager]
    const proc = spawn(command, ['install'], {
      cwd: projectPath,
      stdio: 'ignore',
      shell: true,
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`'${command} install' failed with exit code ${code}`))
      }
    })

    proc.on('error', (err) => {
      reject(new Error(`Failed to run '${command} install': ${err.message}`))
    })
  })
}
