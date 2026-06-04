import pc from 'picocolors'
import { pmCommands } from './templates/common.js'
import type { PackageManager } from './types.js'

export const BANNER = pc.bold(pc.cyan('\n  🚀  Expressit\n'))

export const NEXT_STEPS = (projectPath: string, pm: PackageManager): string => `
  ${pc.bold('Next steps:')}
  ${pc.cyan(`cd ${projectPath}`)}
  ${pc.cyan(`${pmCommands[pm].dev}`)}
`
