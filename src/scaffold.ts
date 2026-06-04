import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { cancel, confirm, isCancel, spinner } from '@clack/prompts'
import pc from 'picocolors'
import { NEXT_STEPS } from './constants.js'
import { commonTemplate, getDockerComposeServices, pmCommands } from './templates/common.js'
import { dbMeta, getDatabaseFiles, getDatabaseMeta } from './templates/database.js'
import { javascriptTemplate } from './templates/javascript.js'
import { typescriptTemplate } from './templates/typescript.js'
import type { Language, PackageManager, PromptResults } from './types.js'
import { gitInit } from './utils/gitInit.js'
import { isDirectoryEmpty } from './utils/isDirectoryEmpty.js'
import { installDependencies } from './utils/packageManager.js'

const templates: Record<Language, Record<string, string>> = {
  javascript: javascriptTemplate,
  typescript: typescriptTemplate,
}

function replacePMPlaceholders(content: string, pm: PackageManager, ext: string): string {
  const cmds = pmCommands[pm]
  return content
    .replaceAll('__PM__', pm)
    .replaceAll('__PM_INSTALL__', cmds.install)
    .replaceAll('__PM_START__', cmds.start)
    .replaceAll('__PM_DEV__', cmds.dev)
    .replaceAll('__PM_BUILD__', cmds.build)
    .replaceAll('__PM_TYPECHECK__', cmds.typecheck)
    .replaceAll('__PM_RUN__', cmds.run)
    .replaceAll('__EXT__', ext)
}

export async function scaffold(options: PromptResults): Promise<void> {
  const { projectName, projectPath, language, databases, packageManager, installDependencies: installDeps } = options

  if (existsSync(projectPath)) {
    const empty = await isDirectoryEmpty(projectPath)
    if (!empty) {
      const shouldOverwrite = await confirm({
        message: `Directory "${projectPath}" is not empty. Overwrite?`,
        initialValue: false,
      })

      if (isCancel(shouldOverwrite) || !shouldOverwrite) {
        cancel('Operation cancelled')
        process.exit(0)
      }
    }
  }

  const spin = spinner()

  spin.start('Creating project...')

  try {
    const ext = language === 'typescript' ? 'ts' : 'js'
    const activeDatabases = databases.filter((d) => d !== 'none')
    const files: Record<string, string> = { ...commonTemplate, ...templates[language] }

    if (activeDatabases.length > 0) {
      const dbFiles = getDatabaseFiles(language, activeDatabases)
      Object.assign(files, dbFiles)
    }

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = join(projectPath, filePath)
      await mkdir(dirname(fullPath), { recursive: true })
      let processed = content.replaceAll('__PROJECT_NAME__', projectName)
      processed = replacePMPlaceholders(processed, packageManager, ext)
      await writeFile(fullPath, processed)
    }

    if (activeDatabases.length > 0) {
      const pkgPath = join(projectPath, 'package.json')
      const pkgRaw = await readFile(pkgPath, 'utf-8')
      const pkg = JSON.parse(pkgRaw)

      const { dependencies, devDependencies } = getDatabaseMeta(activeDatabases)
      Object.assign(pkg.dependencies, dependencies)
      if (devDependencies) {
        if (!pkg.devDependencies) pkg.devDependencies = {}
        Object.assign(pkg.devDependencies, devDependencies)
      }

      await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

      const envPath = join(projectPath, '.env.example')
      const envRaw = await readFile(envPath, 'utf-8')
      let envAppend = ''
      for (const db of activeDatabases) {
        const { envUrl } = dbMeta[db]
        const key = db === activeDatabases[0] ? 'DATABASE_URL' : `DATABASE_URL_${db.toUpperCase()}`
        envAppend += `# ${key}=${envUrl.replaceAll('__PROJECT_NAME__', projectName)}\n`
      }
      if (!envRaw.includes('# DATABASE_URL=')) {
        await writeFile(envPath, envRaw + envAppend)
      }

      const dcPath = join(projectPath, 'docker-compose.yml')
      const dcRaw = await readFile(dcPath, 'utf-8')
      const dbServices = getDockerComposeServices(activeDatabases)
      if (dbServices) {
        const dcWithServices = `${dcRaw}\n${dbServices.replaceAll('__PROJECT_NAME__', projectName)}`
        await writeFile(dcPath, dcWithServices)
      }
    }

    spin.stop('Created project files')

    spin.start('Initializing git repository...')
    try {
      await gitInit(projectPath)
      spin.stop('Git repository initialized')
    } catch {
      spin.stop(pc.yellow('Skipped git init (git not found)'))
    }

    if (installDeps) {
      spin.start('Installing dependencies...')
      await installDependencies(projectPath, packageManager)
      spin.stop('Dependencies installed')
    }

    console.log(`\n${pc.green('✔')} ${pc.bold('Project created successfully!')}`)
    console.log(NEXT_STEPS(projectName, packageManager))
  } catch (error) {
    spin.stop('Failed')
    throw error
  }
}
