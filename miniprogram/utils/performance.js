/**
 * 性能优化工具
 */

const { logger, perf } = require('./logger');
const { errorHandler } = require('./errorHandler');

/**
 * 缓存管理器
 */
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cacheConfig = {
      defaultTTL: 5 * 60 * 1000, // 默认缓存 5 分钟
      maxSize: 100 // 最大缓存数量
    };
  }

  /**
   * 生成缓存键
   */
  generateKey(prefix, params) {
    const keyStr = typeof params === 'string' ? params : JSON.stringify(params);
    return `${prefix}_${keyStr}`;
  }

  /**
   * 设置缓存
   */
  set(key, value, ttl = this.cacheConfig.defaultTTL) {
    const cacheItem = {
      value,
      expireTime: Date.now() + ttl,
      createTime: Date.now()
    };

    // 检查缓存大小
    if (this.memoryCache.size >= this.cacheConfig.maxSize) {
      // 删除最旧的缓存
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, cacheItem);

    logger.debug('CACHE', `设置缓存: ${key}`, {
      ttl,
      size: this.memoryCache.size
    });
  }

  /**
   * 获取缓存
   */
  get(key) {
    const cacheItem = this.memoryCache.get(key);

    if (!cacheItem) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > cacheItem.expireTime) {
      this.memoryCache.delete(key);
      logger.debug('CACHE', `缓存已过期: ${key}`);
      return null;
    }

    logger.debug('CACHE', `获取缓存: ${key}`);
    return cacheItem.value;
  }

  /**
   * 删除缓存
   */
  delete(key) {
    this.memoryCache.delete(key);
    logger.debug('CACHE', `删除缓存: ${key}`);
  }

  /**
   * 清空缓存
   */
  clear() {
    this.memoryCache.clear();
    logger.debug('CACHE', '清空所有缓存');
  }

  /**
   * 批量删除缓存
   */
  deleteByPrefix(prefix) {
    const keysToDelete = [];
    this.memoryCache.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.memoryCache.delete(key));
    logger.debug('CACHE', `删除前缀为 ${prefix} 的缓存`, { count: keysToDelete.length });
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    let expiredCount = 0;
    this.memoryCache.forEach(item => {
      if (Date.now() > item.expireTime) {
        expiredCount++;
      }
    });

    return {
      size: this.memoryCache.size,
      maxSize: this.cacheConfig.maxSize,
      expiredCount
    };
  }
}

// 创建缓存管理器单例
const cacheManager = new CacheManager();

/**
 * 防抖函数
 */
function debounce(func, wait = 500, immediate = false) {
  let timeout = null;

  return function(...args) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);

      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * 节流函数
 */
function throttle(func, wait = 500, options = {}) {
  let timeout = null;
  let previous = 0;

  const { leading = true, trailing = true } = options;

  return function(...args) {
    const context = this;
    const now = Date.now();

    if (!leading && !previous) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * 请求重试
 */
async function retry(requestFn, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    retryCondition = null
  } = options;

  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await requestFn();

      logger.info('RETRY', `请求成功，重试次数: ${i}`);

      return result;
    } catch (error) {
      lastError = error;

      // 检查是否需要重试
      if (retryCondition && !retryCondition(error, i + 1)) {
        throw error;
      }

      logger.warn('RETRY', `请求失败，第 ${i + 1}/${maxRetries} 次重试`, {
        error: error.message
      });

      // 如果不是最后一次，等待后重试
      if (i < maxRetries - 1) {
        const currentDelay = delay * Math.pow(backoff, i);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
  }

  // 所有重试都失败
  throw lastError;
}

/**
 * 并发控制
 */
class ConcurrencyControl {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  /**
   * 执行任务
   */
  async run(task) {
    // 如果当前运行数量达到最大值，加入队列等待
    if (this.running >= this.maxConcurrent) {
      return new Promise((resolve, reject) => {
        this.queue.push({ task, resolve, reject });
      });
    }

    this.running++;
    perf.start(`concurrent_${this.running}`);

    try {
      const result = await task();
      perf.end(`concurrent_${this.running}`);
      return result;
    } catch (error) {
      perf.end(`concurrent_${this.running}`);
      throw error;
    } finally {
      this.running--;
      this.next();
    }
  }

  /**
   * 处理下一个任务
   */
  next() {
    if (this.queue.length > 0 && this.running < this.maxConcurrent) {
      const { task, resolve, reject } = this.queue.shift();

      this.run(task)
        .then(resolve)
        .catch(reject);
    }
  }
}

/**
 * 带缓存的请求
 */
async function cachedRequest(requestFn, cacheKey, ttl = 5 * 60 * 1000) {
  // 尝试从缓存获取
  const cached = cacheManager.get(cacheKey);
  if (cached) {
    logger.debug('CACHE', `缓存命中: ${cacheKey}`);
    return cached;
  }

  // 执行请求
  perf.start(`request_${cacheKey}`);
  const result = await requestFn();
  perf.end(`request_${cacheKey}`);

  // 存入缓存
  cacheManager.set(cacheKey, result, ttl);

  return result;
}

/**
 * 批量请求
 */
async function batchRequest(requests, concurrency = 3) {
  const controller = new ConcurrencyControl(concurrency);

  const results = await Promise.all(
    requests.map(request => controller.run(request))
  );

  return results;
}

/**
 * 预加载资源
 */
class Preloader {
  constructor() {
    this.loaded = new Set();
  }

  /**
   * 预加载图片
   */
  loadImage(url) {
    if (this.loaded.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            this.loaded.add(url);
            logger.debug('PRELOAD', `预加载图片成功: ${url}`);
            resolve(res.tempFilePath);
          } else {
            reject(new Error('图片下载失败'));
          }
        },
        fail: reject
      });
    });
  }

  /**
   * 预加载多张图片
   */
  loadImages(urls) {
    return Promise.all(urls.map(url => this.loadImage(url)));
  }

  /**
   * 检查是否已加载
   */
  isLoaded(url) {
    return this.loaded.has(url);
  }
}

// 创建预加载器单例
const preloader = new Preloader();

/**
 * 页面懒加载
 */
function lazyLoad(callback, threshold = 100) {
  let observer = null;

  return function(page) {
    // 创建 Intersection Observer
    observer = wx.createIntersectionObserver(page, {
      thresholds: [0.1],
      observeAll: false
    });

    observer.relativeToViewport({
      bottom: threshold
    }).observe(page.select('.lazy-load-target'), (res) => {
      if (res.intersectionRatio > 0) {
        callback();
        observer.disconnect();
      }
    });
  };
}

module.exports = {
  CacheManager,
  cacheManager,
  debounce,
  throttle,
  retry,
  ConcurrencyControl,
  batchRequest,
  cachedRequest,
  Preloader,
  preloader,
  lazyLoad
};
