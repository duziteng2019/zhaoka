const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { page = 1, pageSize = 10 } = event

  try {
    const countResult = await db.collection('history').where({ _openid: OPENID }).count()
    const total = countResult.total

    const { data } = await db.collection('history')
      .where({ _openid: OPENID })
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      data: { list: data, total, page, pageSize },
      message: '查询成功'
    }
  } catch (err) {
    console.error('[getHistory] error:', err)
    return { code: -1, message: '查询失败', error: err.message }
  }
}
