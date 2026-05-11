// pages/backgroundReplace/backgroundReplace.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewUrl: '',
    selectedBgColor: '#FFFFFF',
    brightness: 0,
    smooth: 50,
    saturation: 0,
    finalImageId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取裁剪后的图片信息
    const croppedImage = wx.getStorageSync('croppedImage');
    if (!croppedImage) {
      // 如果没有裁剪后的图片，跳转到裁剪页面
      wx.navigateTo({
        url: '/pages/cropEdit/cropEdit'
      });
      return;
    }

    this.setData({
      previewUrl: croppedImage.previewUrl
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '证件照制作',
      path: '/pages/home/home'
    };
  },

  /**
   * 选择背景颜色（WXML调用）
   */
  selectBg(e) {
    this.selectBgColor(e);
  },

  /**
   * 选择背景颜色
   */
  selectBgColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      selectedBgColor: color
    });
    
    // 实时更新预览效果
    this.updateBackground();
  },

  /**
   * 亮度调节变化
   */
  onBrightnessChange(e) {
    this.setData({
      brightness: e.detail.value
    });
    
    // 实时更新预览效果
    this.updateBackground();
  },

  /**
   * 磨皮调节变化
   */
  onSmoothChange(e) {
    this.setData({
      smooth: e.detail.value
    });
    
    // 实时更新预览效果
    this.updateBackground();
  },

  /**
   * 饱和度调节变化
   */
  onSaturationChange(e) {
    this.setData({
      saturation: e.detail.value
    });
    
    // 实时更新预览效果
    this.updateBackground();
  },

  /**
   * 更新背景和美颜效果
   */
  updateBackground() {
    wx.showLoading({
      title: '处理中...'
    });

    // 获取裁剪后的图片信息
    const croppedImage = wx.getStorageSync('croppedImage');
    if (!croppedImage) {
      wx.hideLoading();
      return;
    }

    // 调用replaceBackground云函数进行背景替换和美颜处理
    wx.cloud.callFunction({
      name: 'replaceBackground',
      data: {
        imageUrl: croppedImage.previewUrl,
        bgColor: this.data.selectedBgColor,
        beautyParams: {
          brightness: this.data.brightness,
          smooth: this.data.smooth,
          saturation: this.data.saturation
        }
      },
      success: res => {
        console.log('背景替换成功', res);
        this.setData({
          previewUrl: res.result.data.finalUrl,
          finalImageId: res.result.data.finalImageId
        });
        wx.hideLoading();
      },
      fail: err => {
        console.error('背景替换失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '处理失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 下一步 - 跳转到导出页
   */
  goNext() {
    this.goToExport();
  },

  /**
   * 跳转到导出页面
   */
  goToExport() {
    if (!this.data.finalImageId) {
      wx.showToast({
        title: '请先完成背景替换',
        icon: 'none'
      });
      return;
    }

    // 保存最终图片信息
    wx.setStorageSync('finalImage', {
      previewUrl: this.data.previewUrl,
      finalImageId: this.data.finalImageId,
      bgColor: this.data.selectedBgColor,
      beautyParams: {
        brightness: this.data.brightness,
        smooth: this.data.smooth,
        saturation: this.data.saturation
      }
    });

    // 跳转到导出页面
    wx.navigateTo({
      url: '/pages/export/export'
    });
  }
})