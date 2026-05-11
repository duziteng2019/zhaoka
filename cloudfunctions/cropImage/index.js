const cloud = require('wx-server-sdk')
const Jimp = require('jimp')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { action, fileID, imageUrl, cropParams, targetWidth, targetHeight } = event

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

    if (action === 'preview') {
      if (cropParams) {
        const { x, y, width, height } = cropParams
        image.crop(x, y, width, height)
      }
      if (targetWidth && targetHeight) {
        image.resize(targetWidth, targetHeight)
      }
      const base64 = await image.getBase64Async(Jimp.MIME_JPEG)
      return { code: 0, data: { preview: base64 }, message: '预览成功' }
    }

    if (action === 'apply') {
      if (cropParams) {
        const { x, y, width, height } = cropParams
        image.crop(x, y, width, height)
      }
      if (targetWidth && targetHeight) {
        image.resize(targetWidth, targetHeight)
      }

      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      const cloudPath = `cropped/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
      const uploadResult = await cloud.uploadFile({
        cloudPath,
        fileContent: buffer
      })

      return {
        code: 0,
        data: { fileID: uploadResult.fileID, cloudPath },
        message: '裁剪成功'
      }
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[cropImage] error:', err)
    return { code: -1, message: '裁剪失败', error: err.message }
  }
}
