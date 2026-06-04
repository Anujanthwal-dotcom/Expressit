import { spawn } from 'node:child_process'

export function gitInit(projectPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('git', ['init'], {
      cwd: projectPath,
      stdio: 'ignore',
      shell: true,
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`git init failed with exit code ${code}`))
      }
    })

    proc.on('error', () => {
      reject(new Error('Git is not installed or not found in PATH'))
    })
  })
}
