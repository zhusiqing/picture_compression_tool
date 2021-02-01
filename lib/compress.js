const imagemin = require('imagemin')
const imageminJpg = require('imagemin-mozjpeg')
const imageminPng = require('imagemin-pngquant')

const compressImageCli = async (filePath, q = 50) => {
  const quality = Number(q)
  const files = await imagemin([filePath], {
    plugins: [
      imageminJpg({
        quality
      }),
      imageminPng({
        quality: [quality / 100, quality / 100]
      })
    ]
  })
  const file = files[0]
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
      })
    ]
  })
  return fileBuffer
}
module.exports = {
  compressImageCli,
  compressImageBuffer
}
