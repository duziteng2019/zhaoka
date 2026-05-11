const cloud = require('wx-server-sdk')
const Jimp = require('jimp')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const BG_COLORS = {
  white: { r: 255, g: 255, b: 255 },
  blue: { r: 0, g: 122, b: 255 },
  red: { r: 255, g: 0, b: 0 }
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    (c1.r - c2.r) ** 2 +
    (c1.g - c2.g) ** 2 +
    (c1.b - c2.b) ** 2
  )
}

function isNearColor(pixel, target, threshold) {
  return colorDistance(pixel, target) < threshold
}

function adjustBrightness(r, g, b, amount) {
  return [
    Math.max(0, Math.min(255, r + amount)),
    Math.max(0, Math.min(255, g + amount)),
    Math.max(0, Math.min(255, b + amount))
  ]
}

exports.main = async (event, context) => {
  const { action, fileID, imageUrl, bgColor, beautyParams } = event

  try {
    let image

    if (fileID) {
      const res = await cloud.downloadFile({ fileID })
      image = await Jimp.read(res.fileContent)
    } else if (imageUrl) {
      image = await Jimp.read(imageUrl)
    } else {
      return { code: -1, message: '请提供 fileID 或 imageUrl' }
    }

    const targetColor = BG_COLORS[bgColor] || BG_COLORS.white
    const brightness = beautyParams && beautyParams.brightness ? parseInt(beautyParams.brightness) : 0

    const width = image.bitmap.width
    const height = image.bitmap.height

    image.scan(0, 0, width, height, function(x, y, idx) {
      let r = this.bitmap.data[idx]
      let g = this.bitmap.data[idx + 1]
      let b = this.bitmap.data[idx + 2]

      if (brightness !== 0) {
        const adjusted = adjustBrightness(r, g, b, brightness)
        r = adjusted[0]
        g = adjusted[1]
        b = adjusted[2]
      }

      const bgThreshold = 60
      const pixel = { r, g, b }

      if (action === 'replace') {
        const isWhiteBg = isNearColor(pixel, { r: 255, g: 255, b: 255 }, bgThreshold)
        const isBlueBg = isNearColor(pixel, { r: 0, g: 122, b: 255 }, bgThreshold * 1.5)
        const isRedBg = isNearColor(pixel, { r: 255, g: 0, b: 0 }, bgThreshold * 1.5)

        if (isWhiteBg || isBlueBg || isRedBg) {
          if (bgColor === 'white') {
            this.bitmap.data[idx] = 255
            this.bitmap.data[idx + 1] = 255
            this.bitmap.data[idx + 2] = 255
          } else if (bgColor === 'blue') {
            this.bitmap.data[idx] = targetColor.r
            this.bitmap.data[idx + 1] = targetColor.g
            this.bitmap.data[idx + 2] = targetColor.b
          } else if (bgColor === 'red') {
            this.bitmap.data[idx] = targetColor.r
            this.bitmap.data[idx + 1] = targetColor.g
            this.bitmap.data[idx + 2] = targetColor.b
          }
        }
      } else {
        this.bitmap.data[idx] = r
        this.bitmap.data[idx + 1] = g
        this.bitmap.data[idx + 2] = b
      }
    })

    if (action === 'preview') {
      const base64 = await image.getBase64Async(Jimp.MIME_JPEG)
      return { code: 0, data: { preview: base64 }, message: '预览成功' }
    }

    if (action === 'replace') {
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `final/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
      const uploadResult = await cloud.uploadFile({
        cloudPath,
        fileContent: buffer
      })

      return {
        code: 0,
        data: { fileID: uploadResult.fileID, cloudPath },
        message: '背景替换成功'
      }
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[replaceBackground] error:', err)
    return { code: -1, message: '背景替换失败', error: err.message }
  }
}
