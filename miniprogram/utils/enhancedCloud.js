/**
 * 增强版云开发工具类
 * 集成错误处理、日志记录、性能优化、缓存、重试机制
 */

const { logger, perf } = require('./logger');
const { errorHandler, AppError, ERROR_TYPES } = require('./errorHandler');
const { cacheManager, retry, debounce, throttle, cachedRequest } = require('./performance');

/**
 * 增强版云开发管理器
 */
class EnhancedCloudManager {
  constructor() {
    this.requestQueue = [];
    this.requestInProgress = new Set();
    this.config = {
      enableCache: true,
      enableRetry: true,
      retryOptions: {
        maxRetries: 3,
        delay: 1000,
        backoff: 2
      },
      cacheTTL: 5 * 60 * 1000
    };
  }

  /**
   * 更新配置
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 生成请求缓存键
   */
  generateCacheKey(name, data) {
    return `${name}_${JSON.stringify(data)}`;
  }

  /**
   * 调用云函数（带完整功能）
   */
  async callFunctionEnhanced(name, data = {}, options = {}) {
    const {
      enableCache = this.config.enableCache,
      enableRetry = this.config.enableRetry,
      cacheTTL = this.config.cacheTTL,
      useCache = true
    } = options;

    const cacheKey = this.generateCacheKey(name, data);

    try {
      // 检查是否正在请求相同的数据
      if (this.requestInProgress.has(cacheKey)) {
        logger.info('CLOUD', `请求已在进行中: ${name}`);
        return null;
      }

      this.requestInProgress.add(cacheKey);

      // 缓存处理
      if (useCache && enableCache) {
        const cached = await this.getCachedResponse(cacheKey);
        if (cached) {
          logger.info('CLOUD', `缓存命中: ${name}`);
          return cached;
        }
      }

      // 执行请求
      const requestFn = async () => {
        perf.start(`cloud_${name}`);
        logger.cloudFunction(name, data);

        const result = await wx.cloud.callFunction({
          name,
          data
        });

        perf.end(`cloud_${name}`);

        // 检查响应状态
        if (result.errMsg && !result.errMsg.includes('ok')) {
          throw new AppError(result.errMsg, ERROR_TYPES.NETWORK, -1000);
        }

        logger.cloudFunctionResult(name, result.result, perf.getMetrics()[`cloud_${name}`]?.duration);

        // 缓存结果
        if (useCache && enableCache && result.result && result.result.code === 0) {
          await this.cacheResponse(cacheKey, result.result, cacheTTL);
        }

        return result.result;
      };

      // 重试处理
      let result;
      if (enableRetry) {
        result = await retry(requestFn, this.config.retryOptions);
      } else {
        result = await requestFn();
      }

      return result;

    } catch (error) {
      errorHandler.capture(error, {
        type: 'cloud_function',
        functionName: name,
        params: data
      });
      throw error;
    } finally {
      this.requestInProgress.delete(cacheKey);
    }
  }

  /**
   * 获取缓存响应
   */
  async getCachedResponse(cacheKey) {
    return cacheManager.get(cacheKey);
  }

  /**
   * 缓存响应
   */
  async cacheResponse(cacheKey, response, ttl) {
    cacheManager.set(cacheKey, response, ttl);
  }

  /**
   * 清除缓存
   */
  clearCache(functionName = null) {
    if (functionName) {
      cacheManager.deleteByPrefix(functionName);
    } else {
      cacheManager.clear();
    }
  }

  // ==================== 认证相关 ====================

  /**
   * 用户认证（带缓存）
   */
  async auth(action, data = {}) {
    const options = {
      useCache: ['getUserInfo'].includes(action)
    };
    return await this.callFunctionEnhanced('auth', {
      action,
      ...data
    }, options);
  }

  /**
   * 微信登录
   */
  async wechatLogin(userInfo) {
    return await this.auth('wechatLogin', { userInfo });
  }

  /**
   * 获取用户信息（带缓存）
   */
  async getUserInfo() {
    return await this.auth('getUserInfo');
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(data) {
    // 更新后清除缓存
    const result = await this.auth('updateUserInfo', data);
    this.clearCache('auth');
    return result;
  }

  // ==================== 图片上传 ====================

  /**
   * 图片上传
   */
  async upload(action, data = {}) {
    return await this.callFunctionEnhanced('upload', {
      action,
      ...data
    }, { useCache: false });
  }

  /**
   * 保存图片信息
   */
  async saveImage(params) {
    return await this.upload('saveImage', params);
  }

  /**
   * 获取图片列表
   */
  async getImageList(params) {
    return await this.upload('getImageList', params);
  }

  /**
   * 删除图片
   */
  async deleteImage(params) {
    const result = await this.upload('deleteImage', params);
    this.clearCache('upload');
    return result;
  }

  // ==================== 人像分割 ====================

  /**
   * 人像分割
   */
  async portraitSegment(action, data = {}) {
    return await this.callFunctionEnhanced('portraitSegment', {
      action,
      ...data
    }, { useCache: false });
  }

  /**
   * 执行人像分割
   */
  async segmentPortrait(params) {
    return await this.portraitSegment('segment', params);
  }

  // ==================== 图片裁剪 ====================

  /**
   * 图片裁剪
   */
  async cropImage(action, data = {}) {
    return await this.callFunctionEnhanced('cropImage', {
      action,
      ...data
    }, { useCache: false });
  }

  /**
   * 预览裁剪
   */
  async previewCrop(params) {
    return await this.cropImage('preview', params);
  }

  /**
   * 应用裁剪
   */
  async applyCrop(params) {
    return await this.cropImage('apply', params);
  }

  // ==================== 背景替换 ====================

  /**
   * 背景替换
   */
  async replaceBackground(action, data = {}) {
    return await this.callFunctionEnhanced('replaceBackground', {
      action,
      ...data
    }, { useCache: false });
  }

  /**
   * 替换背景
   */
  async replaceBg(params) {
    return await this.replaceBackground('replace', params);
  }

  // ==================== 订单管理 ====================

  /**
   * 订单管理
   */
  async createOrder(action, data = {}) {
    return await this.callFunctionEnhanced('createOrder', {
      action,
      ...data
    }, { useCache: false });
  }

  /**
   * 创建订单
   */
  async createOrderItem(params) {
    return await this.createOrder('create', params);
  }

  /**
   * 发起支付
   */
  async initiatePayment(params) {
    return await this.createOrder('pay', params);
  }

  /**
   * 获取订单列表
   */
  async getOrders(params) {
    return await this.createOrder('getOrders', params);
  }

  // ==================== 历史记录 ====================

  /**
   * 保存历史记录
   */
  async saveHistoryItem(params) {
    const result = await this.callFunctionEnhanced('saveHistory', {
      action: 'save',
      ...params
    }, { useCache: false });
    this.clearCache('getHistory');
    return result;
  }

  /**
   * 获取历史记录列表（带缓存）
   */
  async getHistoryList(params) {
    return await this.callFunctionEnhanced('getHistory', {
      action: 'list',
      ...params
    }, { useCache: true });
  }

  /**
   * 获取历史记录详情
   */
  async getHistoryDetail(historyId) {
    return await this.callFunctionEnhanced('getHistory', {
      action: 'detail',
      historyId
    }, { useCache: true });
  }

  /**
   * 删除历史记录
   */
  async deleteHistory(historyId) {
    const result = await this.callFunctionEnhanced('deleteHistory', {
      action: 'delete',
      historyId
    }, { useCache: false });
    this.clearCache('getHistory');
    return result;
  }
}

// 创建增强版云开发管理器单例
const enhancedCloudManager = new EnhancedCloudManager();

/**
 * 原版云开发管理器（保持向后兼容）
 */
const cloudManager = enhancedCloudManager;

module.exports = enhancedCloudManager;
