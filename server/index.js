const Koa = require('koa')
const Multer = require('@koa/multer')
const staticHandle = require('koa-static')
const Router = require('@koa/router')
const consola = require('consola')
const { join, basename, resolve } = require('path')
const fs = require('fs')
const { compressImage } = require('../lib')
const { transformSize } = require('../lib/utils')

const app = new Koa()
const router = new Router()
router.prefix('/api')
const upload = Multer()
let port = 5002

process.argv.forEach((s, i) => {
  if (['-p', '--port'].includes(s)) {
    const p = Number(process.argv[i + 1])
    if (p) {
      port = p
    } else {
      consola.error('启动服务失败，端口错误')
      throw new Error('启动服务失败，端口错误')
    }
  }
})
process.on('SIGINT', () => {
  const rmPath = resolve(__dirname, '../web/images')
  fs.rmdir(rmPath, {
    recursive: true
  }, (err) => {
    if (err) {
      console.log(err)
    }
    process.exit()
  })
})
app.use(staticHandle(join(__dirname, '../web')))

router.post('/upload',upload.fields([{ name: 'files' }]), async (ctx, next) => {
  const uploadFormData = ctx.files
  const saveFiles = []
  let success = true, msg = null
  for (let i = 0; i < uploadFormData.files.length; i++) {
    const file = uploadFormData.files[i];
    try {
      const tempPath = await compressImage(file)
      const fileStat = fs.lstatSync(tempPath)
      const fileUrl = basename(tempPath)
      saveFiles.push({
        url: `/images/${fileUrl}`,
        name: fileUrl,
        size: transformSize(fileStat.size)
      })
    } catch (error) {
      consola.error(error)
      success = false
      msg = '图片压缩失败'
    }
  }
  if (success) {
    ctx.body = {
      success,
      files: saveFiles,
      msg: null
    }
  } else {
    ctx.body = {
      success,
      msg
    }
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(port, () => {
  consola.success(`启动成功：http://127.0.0.1:${port}`)
})
