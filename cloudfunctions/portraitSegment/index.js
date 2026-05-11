// 云函数：portraitSegment
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    console.log('[portraitSegment] Called by OPENID:', wxContext.OPENID);
    console.log('[portraitSegment] Event:', JSON.stringify(event));
    
    return {
      code: 0,
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        message: 'portraitSegment executed successfully'
      },
      message: '操作成功'
    };
  } catch (err) {
    console.error('[portraitSegment] Error:', err);
    return {
      code: -1,
      data: null,
      message: '操作失败：' + err.message
    };
  }
};
