const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const MERCHANT_KEY = process.env.WX_PAY_KEY || ''

function generateOrderNo() {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ID${y}${m}${d}${rand}`
}

function generatePaySign(appId, timeStamp, nonceStr, packageStr, signType) {
  const str = `appId=${appId}&nonceStr=${nonceStr}&package=${packageStr}&signType=${signType}&timeStamp=${timeStamp}&key=${MERCHANT_KEY}`
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase()
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext
  if (!OPENID) return { code: -1, message: '未授权' }

  const { action, ...params } = event

  try {
    if (action === 'create') {
      const orderNo = generateOrderNo()
      const orderData = {
        _openid: OPENID,
        orderNo,
        productName: '高清证件照下载',
        amount: 490,
        status: 'pending',
        specId: params.specId || '',
        imageId: params.imageId || '',
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
      const result = await db.collection('orders').add({ data: orderData })
      return {
        code: 0,
        data: { orderId: result._id, orderNo, amount: 490 },
        message: '订单创建成功'
      }
    }

    if (action === 'pay') {
      const { orderId, orderNo } = params

      if (!MERCHANT_KEY) {
        return { code: -2, message: '支付功能暂未开通，请先在商户平台配置' }
      }

      const unifiedResult = await cloud.callWXPayAPI({
        apiName: 'pay/unifiedorder',
        apiParams: {
          out_trade_no: orderNo,
          body: '高清证件照下载',
          total_fee: 490,
          spbill_create_ip: '127.0.0.1',
          trade_type: 'JSAPI',
          openid: OPENID
        }
      })

      const prepayId = unifiedResult && unifiedResult.prepay_id
      if (!prepayId) {
        return { code: -1, message: '统一下单失败', data: unifiedResult }
      }

      const timeStamp = String(Math.floor(Date.now() / 1000))
      const nonceStr = crypto.randomBytes(16).toString('hex')
      const packageStr = `prepay_id=${prepayId}`
      const signType = 'MD5'
      const paySign = generatePaySign(APPID, timeStamp, nonceStr, packageStr, signType)

      await db.collection('orders').doc(orderId).update({
        data: { prepayId, status: 'paying', updatedAt: db.serverDate() }
      })

      return {
        code: 0,
        data: {
          payParams: { timeStamp, nonceStr, package: packageStr, signType, paySign }
        },
        message: '支付参数生成成功'
      }
    }

    if (action === 'getOrders') {
      const { page = 1, pageSize = 10 } = params
      const countResult = await db.collection('orders').where({ _openid: OPENID }).count()
      const { data } = await db.collection('orders')
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
    }

    return { code: -1, message: `未知操作: ${action}` }
  } catch (err) {
    console.error('[createOrder] error:', err)
    return { code: -1, message: '操作失败', error: err.message }
  }
}
