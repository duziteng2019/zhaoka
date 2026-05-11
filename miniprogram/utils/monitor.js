/**
 * 性能监控和错误上报工具
 */

const { logger } = require('./logger');
const { errorHandler } = require('./errorHandler');

/**
 * 性能指标收集
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: [],        // 页面加载时间
      apiCall: [],         // API 调用时间
      cloudFunction: [],   // 云函数调用时间
      userAction: []       // 用户操作时间
    };

    this.config = {
      autoReport: true,        // 自动上报
      reportInterval: 60000,   // 上报间隔（60秒）
      maxMetrics: 1000         // 最大指标数量
    };

    this.timer = null;
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    // 启动定时上报
    if (this.config.autoReport) {
      this.startAutoReport();
    }
  }

  /**
   * 启动自动上报
   */
  startAutoReport() {
    this.timer = setInterval(() => {
      this.reportMetrics();
    }, this.config.reportInterval);
  }

  /**
   * 停止自动上报
   */
  stopAutoReport() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 记录页面加载
   */
  recordPageLoad(pageName, duration, options = {}) {
    const metric = {
      type: 'pageLoad',
      page: pageName,
      duration,
      timestamp: Date.now(),
      ...options
    };

    this.addMetric('pageLoad', metric);
    logger.info('PERF', `页面加载 ${pageName}: ${duration}ms`, options);
  }

  /**
   * 记录 API 调用
   */
  recordApiCall(url, method, duration, success = true, options = {}) {
    const metric = {
      type: 'apiCall',
      url,
      method,
      duration,
      success,
      timestamp: Date.now(),
      ...options
    };

    this.addMetric('apiCall', metric);
    logger.info('PERF', `API ${method} ${url}: ${duration}ms`, { success });
  }

  /**
   * 记录云函数调用
   */
  recordCloudFunction(name, duration, success = true, options = {}) {
    const metric = {
      type: 'cloudFunction',
      name,
      duration,
      success,
      timestamp: Date.now(),
      ...options
    };

    this.addMetric('cloudFunction', metric);
    logger.info('PERF', `云函数 ${name}: ${duration}ms`, { success });
  }

  /**
   * 记录用户操作
   */
  recordUserAction(page, action, duration = 0, options = {}) {
    const metric = {
      type: 'userAction',
      page,
      action,
      duration,
      timestamp: Date.now(),
      ...options
    };

    this.addMetric('userAction', metric);
    logger.debug('PERF', `用户操作 ${page} - ${action}: ${duration}ms`);
  }

  /**
   * 添加指标
   */
  addMetric(category, metric) {
    if (!this.metrics[category]) {
      this.metrics[category] = [];
    }

    this.metrics[category].push(metric);

    // 限制指标数量
    const total = Object.values(this.metrics).reduce((sum, arr) => sum + arr.length, 0);
    if (total > this.config.maxMetrics) {
      this.cleanup();
    }
  }

  /**
   * 清理旧指标
   */
  cleanup() {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1小时前

    Object.keys(this.metrics).forEach(category => {
      this.metrics[category] = this.metrics[category].filter(
        metric => metric.timestamp > oneHourAgo
      );
    });
  }

  /**
   * 获取指标
   */
  getMetrics(category = null) {
    if (category) {
      return this.metrics[category] || [];
    }
    return this.metrics;
  }

  /**
   * 获取性能报告
   */
  getReport() {
    const report = {
      summary: {},
      details: this.metrics
    };

    // 计算汇总信息
    Object.keys(this.metrics).forEach(category => {
      const metrics = this.metrics[category];
      if (metrics.length === 0) {
        return;
      }

      const durations = metrics.map(m => m.duration);
      const successRate = metrics.filter(m => m.success !== false).length / metrics.length;

      report.summary[category] = {
        count: metrics.length,
        avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        successRate: Math.round(successRate * 100) + '%'
      };
    });

    return report;
  }

  /**
   * 上报指标
   */
  async reportMetrics() {
    const report = this.getReport();

    if (Object.keys(report.details).length === 0) {
      return;
    }

    try {
      await wx.cloud.callFunction({
        name: 'perfReport',
        data: {
          report,
          deviceInfo: this.getDeviceInfo(),
          appInfo: this.getAppInfo()
        }
      });

      logger.info('MONITOR', '性能指标上报成功');

      // 清空已上报的指标
      Object.keys(this.metrics).forEach(category => {
        this.metrics[category] = [];
      });
    } catch (err) {
      logger.error('MONITOR', '性能指标上报失败', err);
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
      screenHeight: systemInfo.screenHeight,
      pixelRatio: systemInfo.pixelRatio
    };
  }

  /**
   * 获取应用信息
   */
  getAppInfo() {
    const app = getApp();
    return {
      version: app.globalData?.version || '1.0.0',
      env: app.globalData?.env || 'production',
      userInfo: app.globalData?.userInfo ? {
        id: app.globalData.userInfo._id,
        openid: app.globalData.userInfo.openid
      } : null
    };
  }
}

/**
 * 错误监控
 */
class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.config = {
      autoReport: true,
      reportInterval: 30000,   // 上报间隔（30秒）
      maxErrors: 100
    };

    this.timer = null;
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    if (this.config.autoReport) {
      this.startAutoReport();
    }
  }

  /**
   * 启动自动上报
   */
  startAutoReport() {
    this.timer = setInterval(() => {
      this.reportErrors();
    }, this.config.reportInterval);
  }

  /**
   * 停止自动上报
   */
  stopAutoReport() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 记录错误
   */
  recordError(error, context = {}) {
    const errorObj = {
      error: this.normalizeError(error),
      context,
      timestamp: Date.now(),
      deviceInfo: this.getDeviceInfo(),
      appInfo: this.getAppInfo()
    };

    this.errors.push(errorObj);

    // 限制错误数量
    if (this.errors.length > this.config.maxErrors) {
      this.errors.shift();
    }

    logger.error('MONITOR', '记录错误', errorObj);
  }

  /**
   * 标准化错误对象
   */
  normalizeError(error) {
    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      return { message: error };
    } else if (typeof error === 'object') {
      return {
        message: error.message || '未知错误',
        ...error
      };
    } else {
      return { message: '未知错误' };
    }
  }

  /**
   * 获取错误
   */
  getErrors() {
    return this.errors;
  }

  /**
   * 获取错误报告
   */
  getReport() {
    const report = {
      summary: {
        total: this.errors.length,
        byType: {},
        byLevel: {}
      },
      details: this.errors
    };

    // 统计错误类型
    this.errors.forEach(error => {
      const type = error.error?.type || 'unknown';
      const level = error.error?.level || 'ERROR';

      report.summary.byType[type] = (report.summary.byType[type] || 0) + 1;
      report.summary.byLevel[level] = (report.summary.byLevel[level] || 0) + 1;
    });

    return report;
  }

  /**
   * 上报错误
   */
  async reportErrors() {
    if (this.errors.length === 0) {
      return;
    }

    const report = this.getReport();

    try {
      await wx.cloud.callFunction({
        name: 'errorReport',
        data: {
          errors: this.errors,
          deviceInfo: this.getDeviceInfo(),
          appInfo: this.getAppInfo()
        }
      });

      logger.info('MONITOR', '错误上报成功', { count: this.errors.length });

      // 清空已上报的错误
      this.errors = [];
    } catch (err) {
      logger.error('MONITOR', '错误上报失败', err);
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
      SDKVersion: systemInfo.SDKVersion
    };
  }

  /**
   * 获取应用信息
   */
  getAppInfo() {
    const app = getApp();
    return {
      version: app.globalData?.version || '1.0.0',
      env: app.globalData?.env || 'production'
    };
  }
}

// 创建单例
const perfMonitor = new PerformanceMonitor();
const errorMonitor = new ErrorMonitor();

module.exports = {
  PerformanceMonitor,
  ErrorMonitor,
  perfMonitor,
  errorMonitor
};
