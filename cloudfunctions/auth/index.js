const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, ...params } = event

  console.log(`[AUTH] action=${action}`, JSON.stringify(params))

  switch (action) {
    case 'wechatLogin':
      return await wechatLogin(wxContext, params)
    case 'getUserInfo':
      return await getUserInfo(wxContext)
    case 'updateUserInfo':
      return await updateUserInfo(wxContext, params)
    default:
      return { code: -1, message: '未知操作' }
  }
}

async function wechatLogin(wxContext, params) {
  const { OPENID } = wxContext
  if (!OPENID) {
    return { code: -1, message: '获取用户身份失败' }
  }

  try {
    const { data: users } = await usersCollection.where({ _openid: OPENID }).get()

    if (users.length > 0) {
      const user = users[0]
      return {
        code: 0,
        message: '登录成功',
        data: {
          _id: user._id,
          nickName: user.nickName || '',
          avatarUrl: user.avatarUrl || '',
          totalHistory: user.totalHistory || 0,
          totalDownloads: user.totalDownloads || 0,
          createdAt: user.createdAt
        }
      }
    }

    const userInfo = params.userInfo || {}
    const newUser = {
      _openid: OPENID,
      nickName: userInfo.nickName || params.nickName || '',
      avatarUrl: userInfo.avatarUrl || params.avatarUrl || '',
      totalHistory: 0,
      totalDownloads: 0,
      totalOrders: 0,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }

    const result = await usersCollection.add({ data: newUser })
    return {
      code: 0,
      message: '注册成功',
      data: { _id: result._id, ...newUser }
    }
  } catch (err) {
    console.error('[AUTH] wechatLogin error:', err)
    return { code: -1, message: '登录失败', error: err.message }
  }
}

async function getUserInfo(wxContext) {
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  try {
    const { data: users } = await usersCollection.where({ _openid: OPENID }).get()
    if (users.length === 0) return { code: -1, message: '用户不存在' }

    const user = users[0]
    return {
      code: 0,
      data: {
        _id: user._id,
        nickName: user.nickName || '',
        avatarUrl: user.avatarUrl || '',
        totalHistory: user.totalHistory || 0,
        totalDownloads: user.totalDownloads || 0,
        createdAt: user.createdAt
      }
    }
  } catch (err) {
    return { code: -1, message: '查询失败', error: err.message }
  }
}

async function updateUserInfo(wxContext, params) {
  const { OPENID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const updateData = {}
  if (params.nickName !== undefined) updateData.nickName = params.nickName
  if (params.avatarUrl !== undefined) updateData.avatarUrl = params.avatarUrl
  updateData.updatedAt = db.serverDate()

  if (Object.keys(updateData).length <= 1) {
    return { code: -1, message: '没有可更新的字段' }
  }

  try {
    await usersCollection.where({ _openid: OPENID }).update({ data: updateData })
    return { code: 0, message: '更新成功' }
  } catch (err) {
    return { code: -1, message: '更新失败', error: err.message }
  }
}
