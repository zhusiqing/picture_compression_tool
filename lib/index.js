const path = require('path')
const fs = require('fs')
const consola = require('consola')
const { program } = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const pkg = require('../package.json')
const { compressImageCli, compressImageBuffer } = require('./compress')


const runPath = process.cwd()
let options = {
  input: [],
  output: null,
  quality: '50'
}
const fileQueue = []
async function run() {
  program
    .version(chalk.greenBright.bgBlackBright(pkg.version))
    .option(`-q, --quality ${chalk.yellow.bgBlackBright(' <number> ')}`, 'set picture quality', '50')
    .option(`-o, --output ${chalk.yellow.bgBlackBright(' <path> ')}`, 'set picture output path')

  program
    .arguments('<path...>')
    .description(chalk.keyword('orange')('a picture compression tool'))
    .action((input) => {
      options.input = input
    })
    .parse()

  const { quality, output } = program.opts()
  options.quality = quality
  if (output) {
    options.output = path.resolve(runPath, output)
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
          await _compressImage(path.join(inputPath, fp))
        }
      } else {
        await _compressImage(inputPath)
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

async function _compressImage(filePath) {
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
    const file = await compressImageCli(filePath, quality)
    fs.writeFileSync(outputFile, file.data)
    fileQueue.push(`${path.basename(filePath)} -> ${path.basename(outputFile)}`)
  }
}
async function compressImage(file, quality = 50, savePath = path.resolve(__dirname, '../web/images')) {
  const isExistSavePath = fs.existsSync(savePath)
  if (!isExistSavePath) {
    fs.mkdirSync(savePath)
  }
  const outputPath = path.join(savePath, file.originalname)
  const fileBuffer = await compressImageBuffer(file.buffer, quality)
  fs.writeFileSync(outputPath, fileBuffer)
  return outputPath
}

module.exports = {
  run,
  compressImage
}




