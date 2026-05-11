// 云函数：错误上报
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const errorsCollection = db.collection('errors');

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    const { error, deviceInfo, appInfo } = event;

    // 参数验证
    if (!error || !error.error) {
      return {
        code: -1,
        data: null,
        message: '参数不完整'
      };
    }

    // 保存错误记录
    const result = await errorsCollection.add({
      data: {
        error: error.error,
        context: error.context || {},
        deviceInfo: deviceInfo || {},
        appInfo: appInfo || {},
        openid: wxContext.OPENID,
        createdAt: db.serverDate()
      }
    });

    // 记录日志
    console.log('[ERROR_REPORT]', {
      errorId: result._id,
      errorType: error.error.type,
      errorMessage: error.error.message
    });

    return {
      code: 0,
      data: {
        errorId: result._id
      },
      message: '错误上报成功'
    };
  } catch (err) {
    console.error('错误上报失败:', err);
    return {
      code: -1,
      data: null,
      message: '错误上报失败'
    };
  }
};
