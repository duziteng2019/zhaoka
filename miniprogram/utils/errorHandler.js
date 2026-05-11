/**
 * 全局错误处理工具
 */

// 错误类型枚举
const ERROR_TYPES = {
  NETWORK: 'NETWORK',           // 网络错误
  AUTH: 'AUTH',                 // 认证错误
  VALIDATION: 'VALIDATION',     // 参数验证错误
  BUSINESS: 'BUSINESS',         // 业务逻辑错误
  SYSTEM: 'SYSTEM',             // 系统错误
  TIMEOUT: 'TIMEOUT'            // 超时错误
};

// 错误级别
const ERROR_LEVEL = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * 自定义错误类
 */
class AppError extends Error {
  constructor(message, type = ERROR_TYPES.SYSTEM, code = -1, level = ERROR_LEVEL.ERROR) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.level = level;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 错误处理器
 */
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
  }

  /**
   * 捕获错误
   */
  capture(error, context = {}) {
    const errorObj = {
      error: this.normalizeError(error),
      context,
      timestamp: new Date().toISOString()
    };

    // 添加到队列
    this.errorQueue.push(errorObj);

    // 队列溢出处理
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 记录日志
    this.log(errorObj);

    // 上报错误
    this.report(errorObj);

    return errorObj;
  }

  /**
   * 标准化错误对象
   */
  normalizeError(error) {
    if (error instanceof AppError) {
      return {
        message: error.message,
        type: error.type,
        code: error.code,
        level: error.level,
        timestamp: error.timestamp,
        stack: error.stack
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        type: ERROR_TYPES.SYSTEM,
        code: -1,
        level: ERROR_LEVEL.ERROR,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      return {
        message: error,
        type: ERROR_TYPES.BUSINESS,
        code: -1,
        level: ERROR_LEVEL.WARN
      };
    } else if (typeof error === 'object') {
      return {
        message: error.message || '未知错误',
        type: error.type || ERROR_TYPES.SYSTEM,
        code: error.code || -1,
        level: error.level || ERROR_LEVEL.ERROR,
        data: error
      };
    } else {
      return {
        message: '未知错误',
        type: ERROR_TYPES.SYSTEM,
        code: -1,
        level: ERROR_LEVEL.ERROR
      };
    }
  }

  /**
   * 记录日志
   */
  log(errorObj) {
    const { error, context } = errorObj;
    const logLevel = error.level || ERROR_LEVEL.ERROR;

    let logMessage = `[${logLevel}] [${error.type}] ${error.message}`;

    if (context.page) {
      logMessage += ` | Page: ${context.page}`;
    }

    if (context.action) {
      logMessage += ` | Action: ${context.action}`;
    }

    if (error.stack && logLevel !== ERROR_LEVEL.INFO) {
      console.error(logMessage, error.stack);
    } else {
      console[logLevel.toLowerCase()](logMessage, error.data || '');
    }
  }

  /**
   * 上报错误到云函数
   */
  async report(errorObj) {
    // 只上报 ERROR 和 WARN 级别的错误
    if (errorObj.error.level === ERROR_LEVEL.DEBUG) {
      return;
    }

    try {
      // 上报到云函数
      await wx.cloud.callFunction({
        name: 'errorReport',
        data: {
          error: errorObj,
          deviceInfo: this.getDeviceInfo(),
          appInfo: this.getAppInfo()
        }
      });
    } catch (err) {
      console.error('错误上报失败:', err);
    }
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    const systemInfo = wx.getSystemInfoSync();
    return {
      platform: systemInfo.platform,
      system: systemInfo.system,
      version: systemInfo.version,
      SDKVersion: systemInfo.SDKVersion,
      brand: systemInfo.brand,
      model: systemInfo.model,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight
    };
  }

  /**
   * 获取应用信息
   */
  getAppInfo() {
    const app = getApp();
    return {
      version: app.globalData.version || '1.0.0',
      env: app.globalData.env || 'production',
      userInfo: app.globalData.userInfo ? {
        id: app.globalData.userInfo._id,
        openid: app.globalData.userInfo.openid
      } : null
    };
  }

  /**
   * 获取错误队列
   */
  getErrors() {
    return this.errorQueue;
  }

  /**
   * 清空错误队列
   */
  clearErrors() {
    this.errorQueue = [];
  }

  /**
   * 显示用户友好的错误提示
   */
  showError(error) {
    const normalized = this.normalizeError(error);
    let message = normalized.message;

    // 根据错误类型显示不同的提示
    switch (normalized.type) {
      case ERROR_TYPES.NETWORK:
        message = '网络连接失败，请检查网络设置';
        break;
      case ERROR_TYPES.AUTH:
        message = '登录已过期，请重新登录';
        break;
      case ERROR_TYPES.TIMEOUT:
        message = '请求超时，请重试';
        break;
      case ERROR_TYPES.VALIDATION:
        message = normalized.message;
        break;
      default:
        if (!message) {
          message = '操作失败，请重试';
        }
    }

    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    });
  }
}

// 创建单例
const errorHandler = new ErrorHandler();

/**
 * 全局错误捕获
 */
function setupGlobalErrorHandling() {
  // 捕获 Promise 错误
  const originalPromiseRejectionHandler = wx.onUnhandledRejection;

  wx.onUnhandledRejection = (res) => {
    errorHandler.capture(res.reason, {
      type: 'unhandledRejection',
      promise: res.promise
    });

    // 调用原始处理器
    if (originalPromiseRejectionHandler) {
      originalPromiseRejectionHandler(res);
    }
  };

  // 监听应用错误
  wx.onError((error) => {
    errorHandler.capture(error, {
      type: 'appError'
    });
  });
}

module.exports = {
  ErrorHandler,
  errorHandler,
  AppError,
  ERROR_TYPES,
  ERROR_LEVEL,
  setupGlobalErrorHandling
};
