/**
 * 数据库辅助工具
 * 提供优化的数据库查询方法
 */

const { logger } = require('./logger');
const { errorHandler } = require('./errorHandler');

/**
 * 数据库查询优化工具
 */
class DatabaseHelper {
  constructor() {
    this.queryCache = new Map();
    this.cacheEnabled = true;
    this.defaultCacheTime = 5 * 60 * 1000; // 5 分钟
  }

  /**
   * 生成缓存键
   */
  generateCacheKey(collection, condition, options = {}) {
    const keyStr = JSON.stringify({ collection, condition, options });
    return `db_${keyStr}`;
  }

  /**
   * 设置查询缓存
   */
  setCache(key, data, ttl = this.defaultCacheTime) {
    this.queryCache.set(key, {
      data,
      expireTime: Date.now() + ttl
    });
  }

  /**
   * 获取查询缓存
   */
  getCache(key) {
    const cached = this.queryCache.get(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > cached.expireTime) {
      this.queryCache.delete(key);
      return null;
    }

    logger.debug('DB', '缓存命中', { key });
    return cached.data;
  }

  /**
   * 清除缓存
   */
  clearCache(prefix = null) {
    if (prefix) {
      const keysToDelete = [];
      this.queryCache.forEach((_, key) => {
        if (key.startsWith(prefix)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.queryCache.delete(key));
    } else {
      this.queryCache.clear();
    }
  }

  /**
   * 优化的分页查询
   */
  async paginate(collection, condition = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      order = 'desc',
      useCache = true
    } = options;

    // 参数验证
    if (limit < 1 || limit > 100) {
      throw new Error('limit 参数必须在 1-100 之间');
    }

    if (page < 1) {
      throw new Error('page 参数必须大于 0');
    }

    const cacheKey = this.generateCacheKey(collection, condition, options);

    // 尝试从缓存获取
    if (useCache && this.cacheEnabled) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const db = wx.cloud.database();
    const skip = (page - 1) * limit;

    perf.start(`db_paginate_${collection}`);

    try {
      // 查询总数
      const countResult = await db.collection(collection)
        .where(condition)
        .count();
      const total = countResult.total;

      // 查询数据
      const query = db.collection(collection)
        .where(condition)
        .orderBy(orderBy, order)
        .skip(skip)
        .limit(limit);

      const result = await query.get();

      const response = {
        data: result.data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };

      // 存入缓存
      if (useCache && this.cacheEnabled) {
        this.setCache(cacheKey, response);
      }

      const duration = perf.end(`db_paginate_${collection}`);
      logger.info('DB', `分页查询 ${collection}`, {
        page,
        limit,
        total,
        duration: `${duration}ms`
      });

      return response;
    } catch (err) {
      perf.end(`db_paginate_${collection}`);

      errorHandler.capture(err, {
        type: 'database_query',
        collection,
        action: 'paginate'
      });

      throw err;
    }
  }

  /**
   * 批量查询
   */
  async batchQuery(queries) {
    logger.info('DB', '批量查询', { count: queries.length });

    try {
      const results = await Promise.all(
        queries.map(({ collection, condition, options = {} }) => {
          return this.query(collection, condition, options);
        })
      );

      return results;
    } catch (err) {
      errorHandler.capture(err, {
        type: 'database_query',
        action: 'batchQuery'
      });

      throw err;
    }
  }

  /**
   * 优化的单条查询
   */
  async queryOne(collection, condition, options = {}) {
    const { useCache = true } = options;

    const cacheKey = this.generateCacheKey(collection, condition, { ...options, type: 'one' });

    // 尝试从缓存获取
    if (useCache && this.cacheEnabled) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const db = wx.cloud.database();

    perf.start(`db_queryOne_${collection}`);

    try {
      const result = await db.collection(collection)
        .where(condition)
        .limit(1)
        .get();

      const data = result.data.length > 0 ? result.data[0] : null;

      // 存入缓存
      if (useCache && this.cacheEnabled) {
        this.setCache(cacheKey, data);
      }

      const duration = perf.end(`db_queryOne_${collection}`);
      logger.debug('DB', `查询单条 ${collection}`, { duration: `${duration}ms` });

      return data;
    } catch (err) {
      perf.end(`db_queryOne_${collection}`);

      errorHandler.capture(err, {
        type: 'database_query',
        collection,
        action: 'queryOne'
      });

      throw err;
    }
  }

  /**
   * 优化的列表查询
   */
  async query(collection, condition = {}, options = {}) {
    const {
      limit = 20,
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc',
      useCache = true
    } = options;

    // 限制最大数量
    const validLimit = Math.min(Math.max(limit, 1), 100);

    const cacheKey = this.generateCacheKey(collection, condition, options);

    // 尝试从缓存获取
    if (useCache && this.cacheEnabled) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const db = wx.cloud.database();

    perf.start(`db_query_${collection}`);

    try {
      const query = db.collection(collection)
        .where(condition)
        .orderBy(orderBy, order)
        .skip(offset)
        .limit(validLimit);

      const result = await query.get();

      // 存入缓存
      if (useCache && this.cacheEnabled) {
        this.setCache(cacheKey, result.data);
      }

      const duration = perf.end(`db_query_${collection}`);
      logger.debug('DB', `查询列表 ${collection}`, {
        count: result.data.length,
        duration: `${duration}ms`
      });

      return result.data;
    } catch (err) {
      perf.end(`db_query_${collection}`);

      errorHandler.capture(err, {
        type: 'database_query',
        collection,
        action: 'query'
      });

      throw err;
    }
  }

  /**
   * 批量更新
   */
  async batchUpdate(collection, updates) {
    logger.info('DB', `批量更新 ${collection}`, { count: updates.length });

    try {
      const results = await Promise.all(
        updates.map(({ id, data }) => {
          return wx.cloud.database().collection(collection).doc(id).update({ data });
        })
      );

      // 清除缓存
      this.clearCache(`db_${collection}`);

      return results;
    } catch (err) {
      errorHandler.capture(err, {
        type: 'database_update',
        collection,
        action: 'batchUpdate'
      });

      throw err;
    }
  }

  /**
   * 创建索引建议
   */
  createIndexSuggestion(collection, fields) {
    const suggestions = [];

    fields.forEach(field => {
      suggestions.push({
        collection,
        field,
        type: 'index',
        recommendation: `为 ${collection} 集合的 ${field} 字段创建索引以提升查询性能`
      });
    });

    return suggestions;
  }
}

// 导入 perf 用于性能监控
const perf = {
  start: (name) => {
    global.perfTimers = global.perfTimers || {};
    global.perfTimers[name] = Date.now();
  },
  end: (name) => {
    if (global.perfTimers && global.perfTimers[name]) {
      const duration = Date.now() - global.perfTimers[name];
      delete global.perfTimers[name];
      return duration;
    }
    return 0;
  }
};

// 创建单例
const dbHelper = new DatabaseHelper();

module.exports = {
  DatabaseHelper,
  dbHelper
};
