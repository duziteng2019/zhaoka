// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    totalHistory: 0,
    totalDownloads: 0,
    totalOrders: 0,
    version: '1.0.0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus();
    this.loadStatistics();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
    this.checkLoginStatus();
    this.loadStatistics();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
  },

  /**
   * 微信登录
   */
  async login() {
    wx.showLoading({ title: '登录中...' })
    try {
      const res = await wx.cloud.callFunction({ name: 'login', data: {} })
      wx.hideLoading()
      if (res.result && res.result.openid) {
        const userInfo = { openid: res.result.openid }
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
        wx.showToast({ title: '登录成功', icon: 'success' })
      } else {
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  /**
   * 加载统计数据
   */
  loadStatistics() {
    // 从本地存储获取统计数据（实际项目中应该从云数据库获取）
    const historyList = wx.getStorageSync('historyList') || [];
    const totalHistory = historyList.length;
    const totalDownloads = wx.getStorageSync('totalDownloads') || 0;
    const totalOrders = wx.getStorageSync('totalOrders') || 0;

    this.setData({
      totalHistory: totalHistory,
      totalDownloads: totalDownloads,
      totalOrders: totalOrders
    });
  },

  /**
   * 跳转到历史记录
   */
  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  /**
   * 跳转到设置页面
   */
  goToSettings() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到关于我们
   */
  goToAbout() {
    wx.showToast({
      title: '关于我们开发中',
      icon: 'none'
    });
  },

  /**
   * 跳转到意见反馈
   */
  goToFeedback() {
    wx.showToast({
      title: '意见反馈开发中',
      icon: 'none'
    });
  },

  goToPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.checkLoginStatus();
    this.loadStatistics();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '证件照制作小程序',
      path: '/pages/home/home'
    };
  }
})