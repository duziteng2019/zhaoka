// app.js
const cloudManager = require('./utils/enhancedCloud.js');
const { setupGlobalErrorHandling } = require('./utils/errorHandler');
const { logger, LOG_LEVEL } = require('./utils/logger');
const { perfMonitor, errorMonitor } = require('./utils/monitor');

App({
  onLaunch: function() {
    logger.info('APP', '应用启动');

    // 初始化云开发
    if (!wx.cloud) {
      logger.error('APP', '请使用 2.2.3 或以上的基础库以使用云能力');
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-2ge2s3ln9adb1998', // 云开发环境 ID (已统一)
        traceUser: true,
      });

      logger.info('APP', '云开发初始化成功', { envId: 'cloud1-2ge2s3ln9adb1998' });
    }

    // 设置全局错误处理
    setupGlobalErrorHandling();

    // 设置日志级别
    logger.setLevel(LOG_LEVEL.DEBUG);

    // 启动性能监控
    logger.info('APP', '性能监控已启动');

    // 启动错误监控
    logger.info('APP', '错误监控已启动');

    // 自动登录
    this.autoLogin();
  },

  onShow: function() {
    logger.info('APP', '应用进入前台');
    perfMonitor.recordUserAction('app', 'onShow', 0);
  },

  onHide: function() {
    logger.info('APP', '应用进入后台');
    perfMonitor.recordUserAction('app', 'onHide', 0);
  },

  onError: function(error) {
    logger.error('APP', '全局错误', error);
    errorMonitor.recordError(error, { type: 'global_error' });
  },

  /**
   * 自动登录
   */
  async autoLogin() {
    perfMonitor.recordUserAction('app', 'autoLogin', 0);

    try {
      logger.info('AUTH', '开始自动登录');

      // 调用微信登录
      const loginResult = await cloudManager.wechatLogin();

      if (loginResult && loginResult.code === 0) {
        this.globalData.userInfo = loginResult.data;
        logger.info('AUTH', '自动登录成功', { userId: loginResult.data._id });
      } else {
        logger.warn('AUTH', '自动登录失败', loginResult);
      }
    } catch (err) {
      logger.error('AUTH', '自动登录失败', err);
      errorMonitor.recordError(err, { type: 'auto_login' });
    }
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    selectedSpec: null,
    currentImage: {
      original: null,
      cropped: null,
      final: null
    },
    specs: [
      { id: 1, name: '一寸', size: '25×35mm' },
      { id: 2, name: '二寸', size: '35×49mm' },
      { id: 3, name: '护照', size: '33×48mm' },
      { id: 4, name: '签证', size: '35×45mm' }
    ],
    version: '1.0.0',
    env: 'production'
  }
}); 