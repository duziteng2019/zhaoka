// 云函数：获取证件照规格列表
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const specsCollection = db.collection('specs');

exports.main = async (event, context) => {
  try {
    const result = await specsCollection.orderBy('order', 'asc').get();
    return {
      code: 0,
      data: result.data,
      message: '获取规格成功'
    };
  } catch (err) {
    console.error('获取规格失败:', err);
    return {
      code: -1,
      data: null,
      message: '获取规格失败：' + err.message
    };
  }
};
