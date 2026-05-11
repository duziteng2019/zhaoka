/**
 * 测试云函数是否存在并可用
 */

const testCloudFunctions = async () => {
  console.log('开始测试云函数...');

  const functions = ['errorReport', 'perfReport'];

  for (const funcName of functions) {
    try {
      console.log(`测试云函数: ${funcName}`);
      const result = await wx.cloud.callFunction({
        name: funcName,
        data: {}
      });
      console.log(`${funcName} 测试成功:`, result);
    } catch (err) {
      console.error(`${funcName} 测试失败:`, err);
    }
  }
};

// 导出测试函数
module.exports = {
  testCloudFunctions
};

// 可以在微信开发者工具控制台中运行测试
// const { testCloudFunctions } = require('./utils/testCloudFunctions.js');
// testCloudFunctions();
