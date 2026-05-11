// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specs: [
      { id: 1, name: '一寸', size: '25×35mm' },
      { id: 2, name: '二寸', size: '35×49mm' },
      { id: 3, name: '护照', size: '33×48mm' },
      { id: 4, name: '签证', size: '35×45mm' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
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
    }
  },

  /**
   * 选择规格
   */
  selectSpec(e) {
    const specId = e.currentTarget.dataset.spec;
    const spec = this.data.specs.find(s => s.id == specId);
    
    // 保存选中的规格到全局数据或本地存储
    wx.setStorageSync('selectedSpec', spec);
    
    // 跳转到上传页面
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  },

  /**
   * 立即制作
   */
  startCreate() {
    // 跳转到上传页面
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  }
})