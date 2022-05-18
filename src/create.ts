import * as fs from 'fs-extra'
import { join } from 'path'
import { prompt } from 'inquirer'
import { Generator } from './gen'
import chalk from 'chalk'

type CreateProjectOptions = {
  force?: boolean
}

export const createProject = async (projectName: string, options: CreateProjectOptions) => {
  const cwd = process.cwd()
  const targetAir = join(cwd, projectName)

  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      const { action } = await prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'cover it ?',
              value: 'cover'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])

      if (!action) {
        return
      } else if (action === 'cover') {
        console.log('\r\nRemoving...')
        await fs.remove(targetAir)
      }
    }
  }

  const generator = new Generator(projectName, targetAir)
  await generator.create()
  console.log(`\r\nnow ${projectName} is created`)
  console.log(`\r\ncd ${chalk.cyan(`${projectName}`)}`)
  console.log('\r\npnpm install')
  console.log('\r\npnpm start \r\n')
}
