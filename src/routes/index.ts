import KoaRouter from 'koa-router'
import OSS from 'ali-oss'
import asyncBusboy from 'async-busboy'
import imagemin from 'imagemin'
import getStream from 'get-stream'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'
import path from 'path'
import _ from 'lodash'

import config from '../config'

interface IFields {
  bucket: string
  path: string
  prefix: string
  suffix: string
}

const defualtFields: IFields = {
  bucket: 'default',
  path: '/',
  prefix: '',
  suffix: '',
}

let client = new OSS({
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
})

const router = new KoaRouter()

router.post('/upload', async (ctx, next) => {
  const body = await asyncBusboy(ctx.req)
  const files = body.files
  const fields = { ...defualtFields, ...body.fields }

  client.useBucket(fields.bucket)

  if (!files || files.length === 0) {
    ctx.body = 'error: 文件为空'
    return
  }

  const imgSteam: any = files[0]

  // 限制大小
  if (imgSteam.bytesRead / 1024 > 1024) {
    ctx.body = '文件最大为1MB'
    return
  }

  let imgBuffer = await getStream.buffer(imgSteam)

  if (imgSteam.mimeType !== 'image/gif') {
    // 缩小图片
    imgBuffer = await imagemin.buffer(imgBuffer, {
      plugins: [
        imageminJpegtran(),
        imageminGifsicle(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    })
  }

  const splitNames = imgSteam.filename.split('.')
  const extendName = _.last(splitNames) || ''
  const baseFileName =
    splitNames.length === 1 ? splitNames[0] : _.dropRight(splitNames).join('')

  const fullPath = path
    .join(
      fields.path,
      fields.prefix + baseFileName + fields.suffix + '.' + extendName
    )
    .replace(/\\/g, '/')
  const result = await client.put(fullPath, imgBuffer)
  // @ts-ignore
  ctx.body = result.url
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
  }
})

export default router
