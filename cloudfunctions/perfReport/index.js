// 云函数：性能指标上报
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const perfCollection = db.collection('performance');

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    const { report, deviceInfo, appInfo } = event;

    // 参数验证
    if (!report || !report.summary) {
      return {
        code: -1,
        data: null,
        message: '参数不完整'
      };
    }

    // 保存性能指标
    const result = await perfCollection.add({
      data: {
        report,
        deviceInfo: deviceInfo || {},
        appInfo: appInfo || {},
        openid: wxContext.OPENID,
        createdAt: db.serverDate()
      }
    });

    // 记录日志
    console.log('[PERF_REPORT]', {
      perfId: result._id,
      summary: report.summary
    });

    return {
      code: 0,
      data: {
        perfId: result._id
      },
      message: '性能指标上报成功'
    };
  } catch (err) {
    console.error('性能指标上报失败:', err);
    return {
      code: -1,
      data: null,
      message: '性能指标上报失败'
    };
  }
};
