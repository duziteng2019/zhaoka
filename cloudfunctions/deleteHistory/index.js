const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { id } = event
  if (!id) return { code: -1, message: '缺少记录ID' }

  try {
    await db.collection('history').doc(id).remove()
    return { code: 0, message: '删除成功' }
  } catch (err) {
    console.error('[deleteHistory] error:', err)
    return { code: -1, message: '删除失败', error: err.message }
  }
}
