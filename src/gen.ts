import ora from 'ora'
import { prompt } from 'inquirer'
import {
  readdirSync,
  mkdir,
  existsSync,
  readdir,
  stat,
  createReadStream,
  createWriteStream
} from 'fs-extra'
import { join, resolve } from 'path'

type CopyDirFn = (src: string, dst: string) => void

async function wrapLoading(fn: any, message: string) {
  const spinner = ora(message)
  spinner.start()

  try {
    const result = await fn()
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('Request failed, refetch ...')
  }
}

export class Generator {
  name: string
  targetDir: string

  constructor(name: string, targetDir: string) {
    this.name = name
    this.targetDir = targetDir
  }

  async getRepo() {
    const repos = readdirSync(join(__dirname, '../templates'))
    const { repo } = await prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })
    return repo
  }

  async create() {
    const dirPath = resolve(__dirname, '../templates')
    const root = process.cwd()
    const repo = await this.getRepo()
    await this.mkdir(`${root}/${this.name}`)
    wrapLoading(
      () => this.exists(`${dirPath}/${repo}`, `${root}/${this.name}`, this.copyDir),
      'create template start !'
    )
  }

  mkdir = async (src: string, option = { recursive: true }) => {
    return new Promise((resolve, reject) => {
      mkdir(src, option, (err) => {
        if (err) {
          reject(err)
        }
        resolve(src)
      })
    })
  }

  copyDir = (src: string, dst: string) => {
    const that = this
    readdir(src, (err, paths) => {
      if (err) {
        throw err
      }
      paths.forEach((path) => {
        const _src = src + '/' + path
        const _dst = dst + '/' + path
        let readable
        let writable
        stat(_src, function (err, st) {
          if (err) {
            throw err
          }
          if (st.isFile()) {
            readable = createReadStream(_src)
            writable = createWriteStream(_dst)
            readable.pipe(writable)
          } else if (st.isDirectory()) {
            that.exists(_src, _dst, that.copyDir)
          }
        })
      })
    })
  }

  exists = (src: string, dst: string, callback: CopyDirFn) => {
    if (existsSync(dst)) {
      callback(src, dst)
    } else {
      mkdir(dst, function () {
        callback(src, dst)
      })
    }
  }
}
