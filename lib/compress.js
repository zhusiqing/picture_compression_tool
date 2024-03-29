const imagemin = require('imagemin')
const imageminJpg = require('imagemin-mozjpeg')
const imageminPng = require('imagemin-pngquant')
const imageminSvg = require('imagemin-svgo')

const compressImageCli = async (filePath, q = 50) => {
  const quality = Number(q)
  const files = await imagemin([filePath], {
    plugins: [
      imageminJpg({
        quality
      }),
      imageminPng({
        quality: [quality / 100, quality / 100]
      }),
      imageminSvg({
        plugins: [{
          name: 'preset-default',
          params: {overrides: {removeDoctype: false}},
        },]
      })
    ]
  })
  const file = files[0]
  if (!file) throw new Error(`${filePath}文件处理失败`)
  return file
}
const compressImageBuffer = async (buf, q = 50) => {
  const quality = Number(q)
  const fileBuffer = await imagemin.buffer(buf, {
    plugins: [
      imageminJpg({
        quality
      }),
      imageminPng({
        quality: [quality / 100, quality / 100]
      }),
      imageminSvg({
        plugins: [{
          name: 'preset-default',
          params: {overrides: {removeDoctype: false}},
        },]
      })
    ]
  })
  return fileBuffer
}
Object.defineProperty(exports, '__esModule', { value: true });
exports.compressImageCli = compressImageCli
exports.compressImageBuffer = compressImageBuffer
