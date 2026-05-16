// 云函数：portraitSegment - AI人像分割
// 使用腾讯云 TIIA (图像分析) API 实现人像分割
// 未配密钥时降级为 Jimp 颜色检测
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SECRET_ID = process.env.SECRET_ID || ''
const SECRET_KEY = process.env.SECRET_KEY || ''
const HAS_AI_CREDENTIALS = !!(SECRET_ID && SECRET_KEY)

let tiiaClient = null
if (HAS_AI_CREDENTIALS) {
  try {
    const tencentcloud = require('tencentcloud-sdk-nodejs')
    const TiiaClient = tencentcloud.tiia.v20190529.Client
    const models = tencentcloud.tiia.v20190529.Models
    tiiaClient = {
      client: new TiiaClient({
        credential: { secretId: SECRET_ID, secretKey: SECRET_KEY },
        region: 'ap-guangzhou',
        profile: {
          httpProfile: { endpoint: 'tiia.tencentcloudapi.com' }
        }
      }),
      models
    }
  } catch (e) {
    console.error('[portraitSegment] SDK init error:', e.message)
  }
}

// Jimp降级：基于颜色距离找皮肤/人像区域
async function fallbackSegment(imageBuffer) {
  const Jimp = require('jimp')
  const image = await Jimp.read(imageBuffer)
  const w = image.bitmap.width
  const h = image.bitmap.height

  // 简单肤色检测范围 (HSV近似)
  const skinPixels = []
  const scanStep = Math.max(1, Math.floor(Math.min(w, h) / 80))

  image.scan(0, 0, w, h, function (x, y, idx) {
    if (x % scanStep !== 0 || y % scanStep !== 0) return
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]

    // 简单肤色判断 (RGB范围)
    const isSkin = r > 50 && g > 30 && b > 20 &&
      r > g && r > b &&
      Math.abs(r - g) > 15 &&
      r - b > 10

    if (isSkin) {
      skinPixels.push({ x, y })
    }
  })

  // 生成椭圆mask (以肤色区域中心为基础)
  const mask = new Jimp(w, h, 0x00000000)

  if (skinPixels.length > 10) {
    const cx = skinPixels.reduce((s, p) => s + p.x, 0) / skinPixels.length
    const cy = skinPixels.reduce((s, p) => s + p.y, 0) / skinPixels.length
    const rw = w * 0.45  // 椭圆半宽
    const rh = h * 0.55  // 椭圆半高

    mask.scan(0, 0, w, h, function (x, y, idx) {
      const dx = (x - cx) / rw
      const dy = (y - cy) / rh
      if (dx * dx + dy * dy <= 1) {
        this.bitmap.data[idx] = 255     // R
        this.bitmap.data[idx + 1] = 255 // G
        this.bitmap.data[idx + 2] = 255 // B
        this.bitmap.data[idx + 3] = 255 // A
      }
    })
  }

  const maskBase64 = await mask.getBase64Async(Jimp.MIME_PNG)
  // 抠图结果：mask区域保留原图，外部透明
  const result = new Jimp(w, h, 0x00000000)
  result.composite(image, 0, 0, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1,
    maskSource: mask
  })
  const resultBase64 = await result.getBase64Async(Jimp.MIME_PNG)

  return {
    code: 0,
    data: {
      resultImage: resultBase64,
      resultMask: maskBase64,
      width: w,
      height: h,
      source: 'fallback'
    },
    message: '使用降级分割（未配AI密钥或SDK加载失败）'
  }
}

exports.main = async (event, context) => {
  const { fileID, imageUrl } = event

  try {
    let imageBuffer

    if (fileID) {
      const res = await cloud.downloadFile({ fileID })
      imageBuffer = res.fileContent
    } else if (imageUrl) {
      const request = require('request-promise')
      imageBuffer = await request({ uri: imageUrl, encoding: null })
    } else {
      return { code: -1, message: '请提供 fileID 或 imageUrl' }
    }

    if (!HAS_AI_CREDENTIALS || !tiiaClient) {
      console.log('[portraitSegment] No AI credentials, using fallback')
      return await fallbackSegment(imageBuffer)
    }

    // AI人像分割
    const { client, models } = tiiaClient
    const base64 = imageBuffer.toString('base64')

    const req = new models.SegmentPortraitRequest()
    req.ImageBase64 = base64

    const resp = await client.SegmentPortrait(req)

    if (resp.ResultImage) {
      return {
        code: 0,
        data: {
          resultImage: 'data:image/png;base64,' + resp.ResultImage,
          resultMask: resp.ResultMask ? 'data:image/png;base64,' + resp.ResultMask : '',
          width: resp.Width || 0,
          height: resp.Height || 0,
          source: 'ai'
        },
        message: 'AI人像分割成功'
      }
    }

    // API返回无结果，降级
    console.log('[portraitSegment] API returned no result, falling back')
    return await fallbackSegment(imageBuffer)

  } catch (err) {
    console.error('[portraitSegment] Error:', err.message)

    // 网络错误时自动降级
    if (imageBuffer) {
      try {
        return await fallbackSegment(imageBuffer)
      } catch (fallbackErr) {
        return { code: -1, message: '分割失败', error: fallbackErr.message }
      }
    }

    return { code: -1, message: '分割失败: ' + err.message, error: err.message }
  }
}
