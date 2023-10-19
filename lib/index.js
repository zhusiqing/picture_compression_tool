const path = require('path')
const fs = require('fs')
const consola = require('consola')
const { program } = require('commander')
const chalk = require('chalk')
const ora = require('ora')
const pkg = require('../package.json')
const { compressImageCli, compressImageBuffer } = require('./compress')

// 获取命令行执行路径
const runPath = process.cwd()
let options = {
  input: [],
  output: null,
  quality: '50'
}

// 主程序
async function run() {
  program
    .version(chalk.greenBright.bgBlackBright(pkg.version))
    .option(`-q, --quality ${chalk.yellow.bgBlackBright(' <number> ')}`, 'set picture quality, svg is invalid', '50') // 图片压缩质量，越大越清晰，同时图片大小越大，svg设置无效
    .option(`-o, --output ${chalk.yellow.bgBlackBright(' <path> ')}`, 'set picture output path') // 输出的压缩后的图片路径

  program
    .arguments('<path...>') // 要转换的图片路径
    .description(chalk.keyword('orange')('a picture compression tool')) // 工具描述
    .action((input) => {
      // 拿到文件路径数组
      options.input = input
    })
    .parse()

  const { quality, output } = program.opts()
  options.quality = quality
  if (output) {
    if (path.isAbsolute(output)) {
      options.output = output
    } else {
      options.output = path.resolve(runPath, output)
    }
  }
  console.time('time')
  const spinner = ora('Compressing...').start()
  const fileQueue = []
  for (let index = 0; index < options.input.length; index++) {
    const inputPath = options.input[index];
    try {
      const inputPathStat = fs.lstatSync(inputPath)
      const isDir = inputPathStat.isDirectory()
      if (isDir) {
        // TODO: 如果是目录，进行递归处理，这里只能一层
        const fileDirPaths = fs.readdirSync(inputPath)
        for (let i = 0; i < fileDirPaths.length; i++) {
          const fp = fileDirPaths[i];
          const pathInfo = await _compressImage(path.join(inputPath, fp))
          fileQueue.push(pathInfo)
        }
      } else {
        const pathInfo = await _compressImage(inputPath)
        fileQueue.push(pathInfo)
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
    const file = await compressImageCli(filePath, quality)
    fs.writeFileSync(outputFile, file.data)
    return `${path.basename(filePath)} -> ${path.basename(outputFile)}`
  }
  return `${path.basename(filePath)} failed`
}
// 压缩服务
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




