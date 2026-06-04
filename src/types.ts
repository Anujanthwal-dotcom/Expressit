export type Language = 'javascript' | 'typescript'

export type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn'

export type Database = 'none' | 'mongodb' | 'postgresql' | 'mysql' | 'sqlite' | 'mariadb' | 'sqlserver' | 'redis'

export interface PromptResults {
  projectName: string
  projectPath: string
  language: Language
  databases: Database[]
  packageManager: PackageManager
  installDependencies: boolean
}
