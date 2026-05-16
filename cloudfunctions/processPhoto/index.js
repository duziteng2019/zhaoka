// processPhoto — 一键处理：人脸检测 → 裁剪 → 人像分割 → 换背景
// 不需要腾讯云key。Jimp直算。精度不如AI但零配置。
const cloud = require('wx-server-sdk')
const Jimp = require('jimp')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 背景色映射
const BG_COLORS = {
  white: { r: 255, g: 255, b: 255 },
  blue:  { r: 0, g: 122, b: 255 },
  red:   { r: 255, g: 0, b: 0 }
}

// ─── 人脸检测（基于肤色+位置） ───

function detectFace(image) {
  const w = image.bitmap.width
  const h = image.bitmap.height
  const step = Math.max(2, Math.floor(Math.min(w, h) / 60))
  let skinX = [], skinY = []

  image.scan(0, 0, w, h, function(x, y, idx) {
    if (x % step !== 0 || y % step !== 0) return
    const r = this.bitmap.data[idx], g = this.bitmap.data[idx+1], b = this.bitmap.data[idx+2]
    const isSkin = r > 60 && g > 30 && b > 20 && r > g && r > b && (r - g) > 10
    if (isSkin) { skinX.push(x); skinY.push(y) }
  })

  if (skinX.length < 5) {
    // 没检测到 → 取画面中央
    return {
      x: Math.round(w * 0.2), y: Math.round(h * 0.1),
      width: Math.round(w * 0.6), height: Math.round(h * 0.6),
      source: 'center'
    }
  }

  const cx = Math.round(skinX.reduce((s, v) => s + v, 0) / skinX.length)
  const cy = Math.round(skinY.reduce((s, v) => s + v, 0) / skinY.length)

  return {
    x: Math.max(0, cx - Math.round(w * 0.25)),
    y: Math.max(0, cy - Math.round(h * 0.35)),
    width: Math.min(w - 1, Math.round(w * 0.5)),
    height: Math.min(h - 1, Math.round(h * 0.6)),
    source: 'detect'
  }
}

// ─── 裁剪到目标比例 ───

function cropToSpec(image, specWidth, specHeight) {
  const w = image.bitmap.width, h = image.bitmap.height
  const targetRatio = specWidth / specHeight
  const imgRatio = w / h

  let cropW, cropH, cropX, cropY

  if (imgRatio > targetRatio) {
    cropH = h; cropW = Math.round(h * targetRatio)
    cropX = Math.round((w - cropW) / 2); cropY = 0
  } else {
    cropW = w; cropH = Math.round(w / targetRatio)
    cropX = 0; cropY = Math.round((h - cropH) / 2)
  }

  return image.crop(cropX, cropY, cropW, cropH)
}

// ─── 简单人像分割（颜色检测） ───

function segmentAndReplace(image, bgColor) {
  const target = BG_COLORS[bgColor] || BG_COLORS.white
  const w = image.bitmap.width, h = image.bitmap.height
  const threshold = 65

  image.scan(0, 0, w, h, function(x, y, idx) {
    const r = this.bitmap.data[idx], g = this.bitmap.data[idx+1], b = this.bitmap.data[idx+2]
    const distToWhite = Math.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
    const distToBlue  = Math.sqrt((0-r)**2 + (122-g)**2 + (255-b)**2)
    const distToRed   = Math.sqrt((255-r)**2 + (0-g)**2 + (0-b)**2)

    const isBg = distToWhite < threshold || distToBlue < threshold * 1.5 || distToRed < threshold * 1.5

    if (isBg) {
      this.bitmap.data[idx] = target.r
      this.bitmap.data[idx+1] = target.g
      this.bitmap.data[idx+2] = target.b
    }
  })
  return image
}

// ─── 水印 ───

async function addWatermark(image) {
  const w = image.bitmap.width, h = image.bitmap.height
  const text = '预览版'

  // 底部黑色半透明条
  image.scan(0, 0, w, h, function(x, y, idx) {
    if (y > h - 50 && y < h - 10) {
      if (x > w/2 - 80 && x < w/2 + 80) {
        this.bitmap.data[idx] = 0
        this.bitmap.data[idx+1] = 0
        this.bitmap.data[idx+2] = 0
        this.bitmap.data[idx+3] = this.bitmap.data[idx+3] * 0.4  // 半透明
      }
    }
  })

  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE)
  image.print(font, w/2 - 60, h - 40, text)
  return image
}

// ─── 主入口 ───

exports.main = async (event, context) => {
  const { action, fileID, imageUrl, specName, bgColor, specWidth, specHeight } = event
  // spec: 一寸=25x35mm, 二寸=35x49mm, 护照=33x48mm
  // 默认一寸比例 25:35 = 5:7
  const sw = specWidth || 25, sh = specHeight || 35

  try {
    // 1. 读图
    let image
    if (fileID) {
      const res = await cloud.downloadFile({ fileID })
      image = await Jimp.read(res.fileContent)
    } else if (imageUrl) {
      image = await Jimp.read(imageUrl)
    } else {
      return { code: -1, message: '请提供图片' }
    }

    const originalW = image.bitmap.width
    const originalH = image.bitmap.height

    // 2. 检测人脸
    const face = detectFace(image)

    // 3. 按规格比例裁剪（中心裁切）
    image = cropToSpec(image, sw, sh)

    // 4. 换背景
    const targetColor = bgColor || 'white'
    image = segmentAndReplace(image, targetColor)

    // 5. 缩放到输出尺寸（800x? 保持比例）
    const outH = 800
    const outW = Math.round(outH * sw / sh)
    image.resize(outW, outH)

    if (action === 'preview') {
      // 预览模式：无水印
      const base64 = await image.getBase64Async(Jimp.MIME_JPEG)
      return {
        code: 0,
        data: {
          preview: base64,
          faceSource: face.source,
          width: outW, height: outH
        },
        message: '处理成功'
      }
    }

    if (action === 'watermark') {
      // 免费模式：加水印
      image = await addWatermark(image)
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `preview/${Date.now()}_${Math.random().toString(36).slice(2,8)}.jpg`
      const up = await cloud.uploadFile({ cloudPath, fileContent: buffer })
      return { code: 0, data: { fileID: up.fileID }, message: '预览版已生成' }
    }

    if (action === 'hd') {
      // 高清模式：原画质上传
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `hd/${Date.now()}_${Math.random().toString(36).slice(2,8)}.jpg`
      const up = await cloud.uploadFile({ cloudPath, fileContent: buffer })
      return { code: 0, data: { fileID: up.fileID, width: outW, height: outH }, message: '高清版已生成' }
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[processPhoto] Error:', err.message)
    return { code: -1, message: '处理失败: ' + err.message }
  }
}
