const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { action, cloudPath, url, type } = event

  try {
    if (action === 'saveImage') {
      const data = {
        _openid: OPENID,
        cloudPath: cloudPath || '',
        url: url || '',
        type: type || 'original',
        createdAt: db.serverDate()
      }
      const result = await db.collection('images').add({ data })
      return { code: 0, data: { imageId: result._id }, message: '保存成功' }
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[upload] error:', err)
    return { code: -1, message: '上传失败', error: err.message }
  }
}
