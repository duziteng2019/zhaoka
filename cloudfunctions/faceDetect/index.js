const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const SECRET_ID = process.env.TENCENT_SECRET_ID || ''
const SECRET_KEY = process.env.TENCENT_SECRET_KEY || ''
const HAS_AI_CREDENTIALS = !!(SECRET_ID && SECRET_KEY)

let iaiClient = null
if (HAS_AI_CREDENTIALS) {
  const tencentcloud = require('tencentcloud-sdk-nodejs')
  const IaiClient = tencentcloud.iai.v20200303.Client
  const models = tencentcloud.iai.v20200303.Models
  iaiClient = {
    client: new IaiClient({
      credential: { secretId: SECRET_ID, secretKey: SECRET_KEY },
      region: 'ap-guangzhou',
      profile: { httpProfile: { endpoint: 'iai.tencentcloudapi.com' } }
    }),
    models
  }
}

function fallbackDetect(width, height) {
  const faceW = Math.round(width * 0.4)
  const faceH = Math.round(height * 0.5)
  return {
    code: 0,
    data: {
      faceRect: {
        x: Math.round((width - faceW) / 2),
        y: Math.round((height - faceH) / 4),
        width: faceW,
        height: faceH
      },
      faceNum: 1,
      source: 'fallback'
    },
    message: '使用默认居中检测（未配置 AI 密钥）'
  }
}

exports.main = async (event, context) => {
  const { fileID, imageUrl, action } = event

  if (action === 'skip') {
    return { code: 0, data: { skipped: true }, message: '已跳过' }
  }

  try {
    let imageBuffer
    let width, height

    if (fileID) {
      const downloadResult = await cloud.downloadFile({ fileID })
      imageBuffer = downloadResult.fileContent
    } else if (imageUrl) {
      const request = require('request-promise')
      imageBuffer = await request({ uri: imageUrl, encoding: null })
    } else {
      return { code: -1, message: '请提供 fileID 或 imageUrl' }
    }

    const Jimp = require('jimp')
    const image = await Jimp.read(imageBuffer)
    width = image.bitmap.width
    height = image.bitmap.height

    if (!HAS_AI_CREDENTIALS) {
      console.log('[faceDetect] No AI credentials, using fallback detection')
      return fallbackDetect(width, height)
    }

    const { client, models } = iaiClient
    const base64Image = imageBuffer.toString('base64')

    const req = new models.DetectFaceRequest()
    req.Image = base64Image
    req.NeedFaceRect = 1
    req.NeedQualityInfo = 0
    req.QualityControl = 0

    const resp = await client.DetectFace(req)

    if (resp.FaceInfos && resp.FaceInfos.length > 0) {
      const faceInfo = resp.FaceInfos[0]
      const faceRect = faceInfo.FaceRect
      return {
        code: 0,
        data: {
          faceRect: { x: faceRect.X, y: faceRect.Y, width: faceRect.Width, height: faceRect.Height },
          faceNum: resp.FaceInfos.length,
          source: 'ai'
        },
        message: '人脸检测成功'
      }
    }

    return fallbackDetect(width, height)
  } catch (error) {
    console.error('[faceDetect] error:', error.message)
    return { code: -1, message: '检测失败', error: error.message }
  }
}
