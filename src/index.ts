#! /usr/bin/env node

import { program } from 'commander'
import { createProject } from './create'
import { textSync } from 'figlet'
import chalk from 'chalk'

program
  // 配置版本号信息
  .version(`const-cli ${require('../package.json').version}`)
  .usage('<command> [options]')

program.on('--help', () => {
  console.log(
    '\r\n' +
      textSync('const-cli', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 160,
        whitespaceBreak: true
      })
  )
  console.log(`\r\nRun ${chalk.cyan('roc <command> --help')} show details\r\n`)
})

program
  .command('create <name>')
  .description('welcome use const-cli , you can use it as easy as pie to create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action(async (name, option) => {
    await createProject(name, option)
  })

program.parse(process.argv)
