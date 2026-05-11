// 云开发工具函数库
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

/**
 * 获取用户 OPENID
 */
function getOpenId() {
  const wxContext = cloud.getWXContext();
  return wxContext.OPENID;
}

/**
 * 获取用户信息（包含 OPENID 和 APPID）
 */
function getWXContext() {
  return cloud.getWXContext();
}

/**
 * 成功响应格式
 */
function success(data, message = '操作成功') {
  return {
    code: 0,
    data: data,
    message: message
  };
}

/**
 * 错误响应格式
 */
function error(message, code = -1) {
  return {
    code: code,
    data: null,
    message: message
  };
}

/**
 * 日志记录
 */
function logCloudFunction(funcName, action, data = {}) {
  const logEntry = {
    function: funcName,
    action: action,
    timestamp: new Date().toISOString(),
    data: data
  };
  console.log(`[${funcName.toUpperCase()}] ${action}`, JSON.stringify(logEntry));
  return logEntry;
}

/**
 * 格式化错误信息
 */
function formatError(err) {
  return {
    message: err.message || '未知错误',
    name: err.name,
    stack: err.stack,
    errCode: err.errCode,
    errMsg: err.errMsg
  };
}

/**
 * 初始化数据库
 */
function getDatabase() {
  return cloud.database();
}

module.exports = {
  getOpenId,
  getWXContext,
  success,
  error,
  logCloudFunction,
  formatError,
  getDatabase
};
