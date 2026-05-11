/**
 * 日志工具
 */

// 日志级别
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// 当前日志级别
let currentLevel = LOG_LEVEL.DEBUG;

/**
 * 日志管理器
 */
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
    this.remoteEnabled = true;
  }

  /**
   * 设置日志级别
   */
  setLevel(level) {
    currentLevel = level;
  }

  /**
   * 格式化时间
   */
  formatTime() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 23);
  }

  /**
   * 格式化日志
   */
  format(level, tag, message, data) {
    const levelStr = ['DEBUG', 'INFO', 'WARN', 'ERROR'][level];
    const timeStr = this.formatTime();
    const logData = {
      level: levelStr,
      tag,
      message,
      data,
      timestamp: timeStr
    };

    return logData;
  }

  /**
   * 输出日志
   */
  output(logData) {
    const { level, tag, message, data } = logData;
    const prefix = `[${logData.timestamp}] [${level}] [${tag}]`;
    const content = data ? `${prefix} ${message}\n${JSON.stringify(data)}` : `${prefix} ${message}`;

    // 控制台输出
    if (level === 'DEBUG' && currentLevel <= LOG_LEVEL.DEBUG) {
      console.log(content);
    } else if (level === 'INFO' && currentLevel <= LOG_LEVEL.INFO) {
      console.info(content);
    } else if (level === 'WARN' && currentLevel <= LOG_LEVEL.WARN) {
      console.warn(content);
    } else if (level === 'ERROR' && currentLevel <= LOG_LEVEL.ERROR) {
      console.error(content);
    }

    // 存储到内存
    this.logs.push(logData);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * DEBUG 日志
   */
  debug(tag, message, data) {
    if (currentLevel > LOG_LEVEL.DEBUG) return;
    const logData = this.format(LOG_LEVEL.DEBUG, tag, message, data);
    this.output(logData);
  }

  /**
   * INFO 日志
   */
  info(tag, message, data) {
    if (currentLevel > LOG_LEVEL.INFO) return;
    const logData = this.format(LOG_LEVEL.INFO, tag, message, data);
    this.output(logData);
  }

  /**
   * WARN 日志
   */
  warn(tag, message, data) {
    if (currentLevel > LOG_LEVEL.WARN) return;
    const logData = this.format(LOG_LEVEL.WARN, tag, message, data);
    this.output(logData);
  }

  /**
   * ERROR 日志
   */
  error(tag, message, data) {
    if (currentLevel > LOG_LEVEL.ERROR) return;
    const logData = this.format(LOG_LEVEL.ERROR, tag, message, data);
    this.output(logData);
  }

  /**
   * 记录请求日志
   */
  request(url, method, params) {
    this.info('HTTP', `${method} ${url}`, params);
  }

  /**
   * 记录响应日志
   */
  response(url, method, result, duration) {
    const status = result.code === 0 ? 'SUCCESS' : 'FAIL';
    this.info('HTTP', `${method} ${url} - ${status} (${duration}ms)`, result);
  }

  /**
   * 记录云函数调用日志
   */
  cloudFunction(name, params) {
    this.info('CLOUD', `调用云函数: ${name}`, params);
  }

  /**
   * 记录云函数返回日志
   */
  cloudFunctionResult(name, result, duration) {
    const status = result.code === 0 ? 'SUCCESS' : 'FAIL';
    this.info('CLOUD', `云函数返回: ${name} - ${status} (${duration}ms)`, result);
  }

  /**
   * 记录用户操作日志
   */
  userAction(page, action, data) {
    this.info('USER', `${page} - ${action}`, data);
  }

  /**
   * 获取日志
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * 上传日志到服务器
   */
  async uploadLogs() {
    if (!this.remoteEnabled) return;

    try {
      const cloud = require('./wx-server-sdk').default;

      await cloud.callFunction({
        name: 'logUpload',
        data: {
          logs: this.logs,
          deviceInfo: this.getDeviceInfo()
        }
      });

      this.clearLogs();
    } catch (err) {
      console.error('日志上传失败:', err);
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
}

// 创建单例
const logger = new Logger();

/**
 * 性能监控
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }

  /**
   * 开始计时
   */
  start(name) {
    this.metrics[name] = {
      startTime: Date.now(),
      endTime: null,
      duration: null
    };
  }

  /**
   * 结束计时
   */
  end(name) {
    if (this.metrics[name]) {
      this.metrics[name].endTime = Date.now();
      this.metrics[name].duration = this.metrics[name].endTime - this.metrics[name].startTime;

      logger.info('PERF', `${name}: ${this.metrics[name].duration}ms`);

      return this.metrics[name].duration;
    }
    return null;
  }

  /**
   * 获取性能指标
   */
  getMetrics() {
    return this.metrics;
  }

  /**
   * 监控页面加载时间
   */
  monitorPage(pageName) {
    const startTime = Date.now();

    return {
      end: () => {
        const duration = Date.now() - startTime;
        logger.info('PERF', `页面加载 ${pageName}: ${duration}ms`);
        return duration;
      }
    };
  }
}

// 创建性能监控单例
const perf = new PerformanceMonitor();

module.exports = {
  Logger,
  logger,
  LOG_LEVEL,
  PerformanceMonitor,
  perf
};
