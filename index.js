const path = require('path')
const fs = require('fs')
const images = require('images')
const consola = require('consola')
const { program } = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const { promisify } = require('util')


const runPath = process.cwd()
let options = {
  input: [],
  output: null,
  quality: '50'
}
const fileQueue = []
async function run() {
  program
    .version(chalk.greenBright.bgBlackBright('0.0.1'))
    .option(`-q, --quality ${chalk.yellow.bgBlackBright(' <number> ')}`, 'set picture quality', '50')
    .option(`-o, --output ${chalk.yellow.bgBlackBright(' <path> ')}`, 'set picture output path')
    .arguments('<path...>')
    .description(chalk.keyword('orange')('a picture compression tool'))
    .action((input) => {
      options.input = input
    })
    .parse()

  const { quality, output } = program.opts()
  options.quality = quality
  if (output) {
    options.output = path.join(runPath, output)
  }
  console.time('time')
  const spinner = ora('Compressing...').start()
  for (let index = 0; index < options.input.length; index++) {
    const inputPath = options.input[index];
    try {
      const inputPathStat = fs.lstatSync(inputPath)
      const isDir = inputPathStat.isDirectory()
      if (isDir) {
        const fileDirPaths = fs.readdirSync(inputPath)
        for (let i = 0; i < fileDirPaths.length; i++) {
          const fp = fileDirPaths[i];
          await compressImage(path.join(inputPath, fp))
        }
      } else {
        await compressImage(inputPath)
      }
    } catch (error) {
      consola.error(error)
    }
  }
  spinner.text = chalk.greenBright.bgYellow(' compressed ')
  spinner.succeed()
  fileQueue.forEach(el => consola.success(el))
  console.timeEnd('time')
}
run()

async function compressImage(filePath) {
  const file = await promisify(fs.readFile)(filePath)
  let outputFile = filePath
  if (options.output) {
    outputFile = path.join(options.output, path.basename(filePath))
  }
  const fileExtname = path.extname(filePath)
  if (!outputFile.includes('_compress')) {
    outputFile = outputFile.replace(fileExtname, '_compress' + fileExtname)
    if (fileExtname === '.png') {
      outputFile = outputFile.replace(fileExtname, '.jpg')
    }
    images(file).save(outputFile, { quality: Number(options.quality) })
    fileQueue.push(`${path.basename(filePath)} -> ${path.basename(outputFile)}`)
  }
}




