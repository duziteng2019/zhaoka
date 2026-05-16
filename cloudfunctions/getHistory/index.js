const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { action, page = 1, pageSize = 10 } = event

  try {
    // 存历史
    if (action === 'save') {
      const { specName, fileID, downloadType } = event
      await db.collection('history').add({
        data: {
          _openid: OPENID,
          specName: specName || '证件照',
          fileID: fileID || '',
          downloadType: downloadType || 'free',
          bgColor: 'white',
          createdAt: db.serverDate()
        }
      })
      return { code: 0, message: '保存成功' }
    }

    // 删历史
    if (action === 'delete') {
      const { id } = event
      await db.collection('history').doc(id).remove()
      return { code: 0, message: '删除成功' }
    }

    // 查历史
    const countResult = await db.collection('history').where({ _openid: OPENID }).count()
    const { data } = await db.collection('history')
      .where({ _openid: OPENID })
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      data: { list: data, total: countResult.total, page, pageSize },
      message: '查询成功'
    }
  } catch (err) {
    console.error('[getHistory] error:', err)
    return { code: -1, message: '操作失败', error: err.message }
  }
}
