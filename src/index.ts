import { intro, isCancel, outro } from '@clack/prompts'
import { cac } from 'cac'
import pc from 'picocolors'
import { BANNER } from './constants.js'
import { promptUser } from './prompts.js'
import { scaffold } from './scaffold.js'

async function main() {
  const cli = cac('expressit')

  cli
    .command('[project-directory]', 'Create a new Express project')
    .action(async (projectDirectory: string | undefined) => {
      console.log(BANNER)
      intro(pc.inverse(' expressit '))

      try {
        const options = await promptUser(projectDirectory)
        await scaffold(options)
        outro(pc.green('Happy coding!'))
      } catch (error) {
        if (isCancel(error)) {
          process.exit(0)
        }
        console.error(
          `\n${pc.red('✖')} ${pc.bold('Error:')} ${error instanceof Error ? error.message : 'An unexpected error occurred'}`,
        )
        process.exit(1)
      }
    })

  cli.help()
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}

main()
