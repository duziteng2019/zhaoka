// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      username: '',
      password: ''
    },
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 输入处理函数
   */
  onInput(e) {
    const { name, value } = e.detail;
    this.setData({
      [`formData.${name}`]: value
    });
  },

  /**
   * 表单验证
   */
  validateForm() {
    const { username, password } = this.data.formData;
    
    // 验证用户名
    if (!username || username.trim().length < 3) {
      wx.showToast({
        title: '请输入正确的用户名',
        icon: 'none'
      });
      return false;
    }
    
    // 验证密码
    if (!password || password.length < 6) {
      wx.showToast({
        title: '请输入正确的密码',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 登录函数
   */
  async login(e) {
    if (!this.validateForm()) {
      return;
    }
    
    this.setData({ loading: true });
    
    try {
      const { username, password } = this.data.formData;
      
      // 调用云函数进行登录
      const result = await wx.cloud.callFunction({
        name: 'auth',
        data: {
          action: 'login',
          username,
          password
        }
      });
      
      if (result.result.code === 0) {
        // 登录成功
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 存储用户信息到本地
        wx.setStorageSync('userInfo', result.result.data);
        
        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/home/home'
          });
        }, 1500);
      } else {
        // 登录失败
        wx.showToast({
          title: result.result.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
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

  }
})
