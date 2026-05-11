const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { spec, originalFileID, croppedFileID, finalFileID, bgColor } = event

  try {
    const data = {
      _openid: OPENID,
      spec: spec || {},
      originalFileID: originalFileID || '',
      croppedFileID: croppedFileID || '',
      finalFileID: finalFileID || '',
      bgColor: bgColor || 'white',
      createdAt: db.serverDate()
    }
    const result = await db.collection('history').add({ data })
    return { code: 0, data: { _id: result._id }, message: '保存成功' }
  } catch (err) {
    console.error('[saveHistory] error:', err)
    return { code: -1, message: '保存失败', error: err.message }
  }
}
