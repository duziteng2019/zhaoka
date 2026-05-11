// pages/upload/upload.js
const cloudManager = require('../../utils/enhancedCloud.js');
const { errorHandler } = require('../../utils/errorHandler');
const { logger, perf } = require('../../utils/logger');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewUrl: '',
    tempFilePath: '',
    imageId: '',
    uploading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    logger.info('PAGE', 'upload 页面加载');

    // 检查是否已有选中的规格
    const selectedSpec = wx.getStorageSync('selectedSpec');
    if (!selectedSpec) {
      // 如果没有选中的规格，跳转到规格选择页
      wx.navigateTo({
        url: '/pages/sizeSelect/sizeSelect'
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    logger.userAction('upload', '页面显示');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    logger.userAction('upload', '页面隐藏');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    logger.userAction('upload', '分享页面');
    return {
      title: '证件照制作',
      path: '/pages/home/home'
    }
  },

  /**
   * 从相册选择照片
   */
  async chooseImage() {
    logger.userAction('upload', '从相册选择照片');

    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album']
      });

      const tempFilePath = res.tempFilePaths[0];

      this.setData({
        previewUrl: tempFilePath,
        tempFilePath: tempFilePath
      });

      await this.uploadImage(tempFilePath);
    } catch (err) {
      errorHandler.capture(err, {
        page: 'upload',
        action: 'chooseImage'
      });
      errorHandler.showError(err);
    }
  },

  /**
   * 拍照
   */
  async takePhoto() {
    logger.userAction('upload', '拍照');

    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera']
      });

      const tempFilePath = res.tempFilePaths[0];

      this.setData({
        previewUrl: tempFilePath,
        tempFilePath: tempFilePath
      });

      await this.uploadImage(tempFilePath);
    } catch (err) {
      errorHandler.capture(err, {
        page: 'upload',
        action: 'takePhoto'
      });
      errorHandler.showError(err);
    }
  },

  /**
   * 上传图片到云存储
   */
  async uploadImage(filePath) {
    if (this.data.uploading) {
      logger.warn('UPLOAD', '上传中，忽略重复请求');
      return;
    }

    this.setData({ uploading: true });
    wx.showLoading({ title: '上传中...' });

    perf.start('upload_image');

    try {
      // 1. 直接上传到云存储
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: `images/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`,
        filePath: filePath
      });

      logger.info('UPLOAD', '图片上传成功', {
        fileID: uploadResult.fileID
      });

      // 2. 保存图片信息到数据库
      const saveResult = await cloudManager.saveImage({
        cloudPath: uploadResult.fileID,
        url: uploadResult.fileID,
        type: 'original'
      });

      if (saveResult.code !== 0) {
        throw new Error(saveResult.message);
      }

      // 3. 更新页面数据
      this.setData({
        imageId: saveResult.data.imageId
      });

      // 4. 保存到全局数据
      const app = getApp();
      app.globalData.currentImage.original = {
        previewUrl: filePath,
        imageId: saveResult.data.imageId,
        tempFilePath: filePath,
        cloudPath: uploadResult.fileID
      };

      const duration = perf.end('upload_image');
      logger.info('UPLOAD', `上传完成，耗时 ${duration}ms`);

      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });

    } catch (err) {
      perf.end('upload_image');

      errorHandler.capture(err, {
        page: 'upload',
        action: 'uploadImage',
        filePath
      });

      wx.hideLoading();
      errorHandler.showError(err);
    } finally {
      this.setData({ uploading: false });
    }
  },

  /**
   * 下一步 - 跳转到裁剪页
   */
  goNext() {
    if (!this.data.tempFilePath || !this.data.imageId) {
      wx.showToast({
        title: '请先上传照片',
        icon: 'none'
      });
      return;
    }

    logger.userAction('upload', '跳转到裁剪页');

    // 保存到本地存储
    wx.setStorageSync('uploadedImage', {
      previewUrl: this.data.previewUrl,
      imageId: this.data.imageId,
      tempFilePath: this.data.tempFilePath
    });

    // 跳转到裁剪页
    wx.navigateTo({
      url: '/pages/cropEdit/cropEdit'
    });
  },

  /**
   * 跳转到规格选择页
   */
  goToSizeSelect() {
    if (!this.data.previewUrl || !this.data.imageId) {
      wx.showToast({
        title: '请先上传照片',
        icon: 'none'
      });
      return;
    }

    logger.userAction('upload', '跳转到规格选择页');

    // 保存到本地存储
    wx.setStorageSync('uploadedImage', {
      previewUrl: this.data.previewUrl,
      imageId: this.data.imageId,
      tempFilePath: this.data.tempFilePath
    });

    // 跳转到规格选择页
    wx.navigateTo({
      url: '/pages/sizeSelect/sizeSelect'
    });
  }
})