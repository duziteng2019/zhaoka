const cloud = require('wx-server-sdk')
const Jimp = require('jimp')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const BG_COLORS = {
  white: { r: 255, g: 255, b: 255 },
  blue: { r: 0, g: 122, b: 255 },
  red: { r: 255, g: 0, b: 0 }
}

// ─── 颜色距离（降级用） ───

function colorDistance(c1, c2) {
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2)
}

function adjustBrightness(r, g, b, amount) {
  return [
    Math.max(0, Math.min(255, r + amount)),
    Math.max(0, Math.min(255, g + amount)),
    Math.max(0, Math.min(255, b + amount))
  ]
}

function applySaturation(r, g, b, amount) {
  const gray = 0.299 * r + 0.587 * g + 0.114 * b
  const f = 1 + amount / 100
  return [
    Math.max(0, Math.min(255, Math.round(gray + (r - gray) * f))),
    Math.max(0, Math.min(255, Math.round(gray + (g - gray) * f))),
    Math.max(0, Math.min(255, Math.round(gray + (b - gray) * f)))
  ]
}

// ─── mask方式：用分割结果换背景 ───

function applyMask(image, mask, targetColor) {
  const w = image.bitmap.width
  const h = image.bitmap.height

  image.scan(0, 0, w, h, function (x, y, idx) {
    const maskIdx = (y * w + x) * 4
    const maskR = mask.bitmap.data[maskIdx]
    const maskG = mask.bitmap.data[maskIdx + 1]
    const maskB = mask.bitmap.data[maskIdx + 2]

    // mask白=人像保留，mask黑=背景替换
    const isPerson = (maskR + maskG + maskB) > 128 * 3
    if (!isPerson) {
      this.bitmap.data[idx] = targetColor.r
      this.bitmap.data[idx + 1] = targetColor.g
      this.bitmap.data[idx + 2] = targetColor.b
    }
  })
  return image
}

// ─── 颜色检测方式（降级） ───

function applyColorDetection(image, bgColor, targetColor, brightness) {
  const w = image.bitmap.width
  const h = image.bitmap.height

  image.scan(0, 0, w, h, function (x, y, idx) {
    let r = this.bitmap.data[idx]
    let g = this.bitmap.data[idx + 1]
    let b = this.bitmap.data[idx + 2]

    if (brightness !== 0) {
      const adj = adjustBrightness(r, g, b, brightness)
      r = adj[0]; g = adj[1]; b = adj[2]
    }

    const bgThreshold = 60
    const pixel = { r, g, b }
    const isWhiteBg = colorDistance(pixel, { r: 255, g: 255, b: 255 }) < bgThreshold
    const isBlueBg = colorDistance(pixel, { r: 0, g: 122, b: 255 }) < bgThreshold * 1.5
    const isRedBg = colorDistance(pixel, { r: 255, g: 0, b: 0 }) < bgThreshold * 1.5

    if (isWhiteBg || isBlueBg || isRedBg) {
      this.bitmap.data[idx] = targetColor.r
      this.bitmap.data[idx + 1] = targetColor.g
      this.bitmap.data[idx + 2] = targetColor.b
    } else {
      this.bitmap.data[idx] = r
      this.bitmap.data[idx + 1] = g
      this.bitmap.data[idx + 2] = b
    }
  })
  return image
}

// ─── 美颜（磨皮） ───

function applySmoothing(image, amount) {
  if (amount <= 0) return image
  const w = image.bitmap.width
  const h = image.bitmap.height
  const strength = amount / 100
  const copy = image.clone()

  image.scan(1, 1, w - 2, h - 2, function (x, y, idx) {
    let rSum = 0, gSum = 0, bSum = 0, count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const si = ((y + dy) * w + (x + dx)) * 4
        rSum += copy.bitmap.data[si]
        gSum += copy.bitmap.data[si + 1]
        bSum += copy.bitmap.data[si + 2]
        count++
      }
    }
    const avgR = rSum / count, avgG = gSum / count, avgB = bSum / count
    this.bitmap.data[idx] = Math.round(this.bitmap.data[idx] * (1 - strength) + avgR * strength)
    this.bitmap.data[idx + 1] = Math.round(this.bitmap.data[idx + 1] * (1 - strength) + avgG * strength)
    this.bitmap.data[idx + 2] = Math.round(this.bitmap.data[idx + 2] * (1 - strength) + avgB * strength)
  })
  return image
}

// ─── 入口 ───

exports.main = async (event, context) => {
  const { action, fileID, imageUrl, bgColor, beautyParams, maskBase64 } = event

  try {
    let image
    let hasValidMask = false

    if (fileID) {
      const res = await cloud.downloadFile({ fileID })
      image = await Jimp.read(res.fileContent)
    } else if (imageUrl) {
      image = await Jimp.read(imageUrl)
    } else {
      return { code: -1, message: '请提供 fileID 或 imageUrl' }
    }

    const targetColor = BG_COLORS[bgColor] || BG_COLORS.white
    const brightness = beautyParams?.brightness ? parseInt(beautyParams.brightness) : 0
    const smooth = beautyParams?.smooth ? parseInt(beautyParams.smooth) : 0
    const saturation = beautyParams?.saturation ? parseInt(beautyParams.saturation) : 0

    // 1. 亮度
    if (brightness !== 0) {
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const adj = adjustBrightness(
          this.bitmap.data[idx],
          this.bitmap.data[idx + 1],
          this.bitmap.data[idx + 2],
          brightness
        )
        this.bitmap.data[idx] = adj[0]
        this.bitmap.data[idx + 1] = adj[1]
        this.bitmap.data[idx + 2] = adj[2]
      })
    }

    // 2. 磨皮
    if (smooth > 0) {
      image = applySmoothing(image, smooth)
    }

    // 3. 饱和度
    if (saturation !== 0) {
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const adj = applySaturation(
          this.bitmap.data[idx],
          this.bitmap.data[idx + 1],
          this.bitmap.data[idx + 2],
          saturation
        )
        this.bitmap.data[idx] = adj[0]
        this.bitmap.data[idx + 1] = adj[1]
        this.bitmap.data[idx + 2] = adj[2]
      })
    }

    // 4. 背景替换：有mask用mask，没有用颜色检测
    if (maskBase64) {
      try {
        const mask = await Jimp.read(Buffer.from(maskBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
        // 确保mask尺寸匹配
        if (mask.bitmap.width === image.bitmap.width && mask.bitmap.height === image.bitmap.height) {
          image = applyMask(image, mask, targetColor)
          hasValidMask = true
        }
      } catch (e) {
        console.log('[replaceBackground] Mask读取出错，降级到颜色检测:', e.message)
      }
    }

    if (!hasValidMask) {
      image = applyColorDetection(image, bgColor, targetColor, brightness)
    }

    // 水印模式：低质 + 水印
    if (action === 'watermark') {
      // 缩放到50%
      image.resize(image.bitmap.width / 2, Jimp.AUTO)

      // 叠加半透明水印文字
      const w = image.bitmap.width
      const h = image.bitmap.height
      const overlay = new Jimp(w, h, 0x00000000)
      const Jimp2 = require('jimp')
      // 用半透明色块 + 文字模拟水印
      const font = await Jimp2.loadFont(Jimp2.FONT_SANS_16_WHITE)
      const watermarkText = '证件照 · 预览版'
      const textW = watermarkText.length * 10
      overlay.scan(0, 0, w, h, function (x, y, idx) {
        // 底部居中水印条
        if (y > h - 60 && y < h - 10 && x > (w - textW) / 2 - 20 && x < (w + textW) / 2 + 20) {
          this.bitmap.data[idx] = 0
          this.bitmap.data[idx + 1] = 0
          this.bitmap.data[idx + 2] = 0
          this.bitmap.data[idx + 3] = 140  // 半透明
        }
      })
      image.composite(overlay, 0, 0)
      image.print(font, (w - textW) / 2, h - 48, watermarkText)

      // 低质量压缩上传
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `preview/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
      const uploadResult = await cloud.uploadFile({ cloudPath, fileContent: buffer })

      return {
        code: 0,
        data: {
          fileID: uploadResult.fileID,
          cloudPath,
          width: w,
          height: h
        },
        message: '预览版已生成'
      }
    }

    // 预览模式：返回base64
    if (action === 'preview') {
      const base64 = await image.getBase64Async(Jimp.MIME_JPEG)
      return { code: 0, data: { preview: base64 }, message: '预览成功' }
    }

    // 替换模式：上传到云存储
    if (action === 'replace') {
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `final/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
      const uploadResult = await cloud.uploadFile({ cloudPath, fileContent: buffer })

      return {
        code: 0,
        data: {
          fileID: uploadResult.fileID,
          cloudPath,
          maskUsed: hasValidMask
        },
        message: hasValidMask ? 'AI背景替换成功' : '背景替换成功（颜色检测模式）'
      }
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[replaceBackground] error:', err)
    return { code: -1, message: '背景替换失败', error: err.message }
  }
}
