// 云开发工具类 - 统一管理云函数调用
const cloud = require('wx-server-sdk');

/**
 * 云开发管理器
 */
class CloudManager {
  constructor() {
    this.cloud = cloud;
  }

  /**
   * 调用云函数
   * @param {string} name - 云函数名称
   * @param {Object} data - 传递参数
   * @returns {Promise<Object>} - 返回结果
   */
  async callFunction(name, data = {}) {
    try {
      const result = await cloud.callFunction({
        name,
        data
      });

      if (result.errMsg && !result.errMsg.includes('ok')) {
        throw new Error(result.errMsg);
      }

      return result.result;
    } catch (err) {
      console.error(`云函数 ${name} 调用失败:`, err);
      throw err;
    }
  }

  /**
   * 用户认证
   */
  async auth(action, data = {}) {
    return await this.callFunction('auth', {
      action,
      ...data
    });
  }

  /**
   * 微信登录
   */
  async wechatLogin(userInfo) {
    return await this.auth('wechatLogin', { userInfo });
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    return await this.auth('getUserInfo');
  }

  /**
   * 图片上传
   */
  async upload(action, data = {}) {
    return await this.callFunction('upload', {
      action,
      ...data
    });
  }

  /**
   * 获取临时上传 URL
   */
  async getTempURL(fileType = 'image') {
    return await this.upload('getTempURL', { fileType });
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
    return await this.upload('deleteImage', params);
  }

  /**
   * 人像分割
   */
  async portraitSegment(action, data = {}) {
    return await this.callFunction('portraitSegment', {
      action,
      ...data
    });
  }

  /**
   * 图片裁剪
   */
  async cropImage(action, data = {}) {
    return await this.callFunction('cropImage', {
      action,
      ...data
    });
  }

  /**
   * 预览裁剪
   */
  async previewCrop(params) {
    return await this.cropImage('preview', params);
  }

  /**
   * 手动调整裁剪
   */
  async adjustCrop(params) {
    return await this.cropImage('adjust', params);
  }

  /**
   * 应用裁剪
   */
  async applyCrop(params) {
    return await this.cropImage('apply', params);
  }

  /**
   * 背景替换
   */
  async replaceBackground(action, data = {}) {
    return await this.callFunction('replaceBackground', {
      action,
      ...data
    });
  }

  /**
   * 替换背景
   */
  async replaceBg(params) {
    return await this.replaceBackground('replace', params);
  }

  /**
   * 预览背景
   */
  async previewBg(params) {
    return await this.replaceBackground('preview', params);
  }

  /**
   * 订单管理
   */
  async createOrder(action, data = {}) {
    return await this.callFunction('createOrder', {
      action,
      ...data
    });
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

  /**
   * 历史记录
   */
  async saveHistory(action, data = {}) {
    return await this.callFunction('saveHistory', {
      action,
      ...data
    });
  }

  /**
   * 保存历史记录
   */
  async saveHistoryItem(params) {
    return await this.saveHistory('save', params);
  }

  /**
   * 获取历史记录列表
   */
  async getHistoryList(params) {
    return await this.callFunction('getHistory', {
      action: 'list',
      ...params
    });
  }

  /**
   * 获取历史记录详情
   */
  async getHistoryDetail(historyId) {
    return await this.callFunction('getHistory', {
      action: 'detail',
      historyId
    });
  }

  /**
   * 删除历史记录
   */
  async deleteHistory(historyId) {
    return await this.callFunction('deleteHistory', {
      action: 'delete',
      historyId
    });
  }
}

// 创建单例
const cloudManager = new CloudManager();

module.exports = cloudManager;
