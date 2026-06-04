import { basename, join } from 'node:path'
import { cancel, confirm, isCancel, multiselect, select, text } from '@clack/prompts'
import type { Database, Language, PackageManager, PromptResults } from './types.js'
import { validateProjectName } from './utils/validateProjectName.js'

export async function promptUser(providedName?: string): Promise<PromptResults> {
  let projectName = providedName

  if (!projectName) {
    const result = await text({
      message: 'What is your project name?',
      placeholder: 'my-express-app',
      validate: (value) => {
        if (!value) return 'Project name cannot be empty'
        const validation = validateProjectName(value)
        if (validation !== true) return validation
      },
    })

    if (isCancel(result)) {
      cancel('Operation cancelled')
      process.exit(0)
    }

    projectName = result
  }

  if (projectName === '.') {
    projectName = basename(process.cwd())
  }

  const languageResult = await select({
    message: 'Select a language:',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript', hint: 'recommended' },
    ],
  })

  if (isCancel(languageResult)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const addDbResult = await select({
    message: 'Would you like to add a database?',
    options: [
      { value: 'none', label: 'No, skip' },
      { value: 'yes', label: 'Yes, select databases' },
    ],
  })

  if (isCancel(addDbResult)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  let databases: Database[] = []

  if (addDbResult === 'yes') {
    const dbResult = await multiselect({
      message: 'Select databases:',
      required: true,
      options: [
        { value: 'mongodb', label: 'MongoDB', hint: 'Mongoose' },
        { value: 'postgresql', label: 'PostgreSQL', hint: 'pg' },
        { value: 'mysql', label: 'MySQL', hint: 'mysql2' },
        { value: 'sqlite', label: 'SQLite', hint: 'better-sqlite3' },
        { value: 'mariadb', label: 'MariaDB', hint: 'mariadb' },
        { value: 'sqlserver', label: 'SQL Server', hint: 'mssql' },
        { value: 'redis', label: 'Redis', hint: 'ioredis' },
      ],
    })

    if (isCancel(dbResult)) {
      cancel('Operation cancelled')
      process.exit(0)
    }

    databases = dbResult as Database[]
  }

  const packageManagerResult = await select({
    message: 'Select a package manager:',
    options: [
      { value: 'bun', label: 'Bun', hint: 'recommended' },
      { value: 'npm', label: 'npm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'pnpm', label: 'pnpm' },
    ],
  })

  if (isCancel(packageManagerResult)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const installResult = await confirm({
    message: 'Install dependencies?',
    initialValue: true,
  })

  if (isCancel(installResult)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const projectPath = providedName === '.' ? process.cwd() : join(process.cwd(), projectName)

  return {
    projectName,
    projectPath,
    language: languageResult as Language,
    databases,
    packageManager: packageManagerResult as PackageManager,
    installDependencies: installResult,
  }
}
