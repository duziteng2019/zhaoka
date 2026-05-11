// pages/sizeSelect/sizeSelect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specs: [],
    selectedSpec: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化规格数据
    this.initSpecs();
    
    // 检查是否已有选中的规格
    const selectedSpec = wx.getStorageSync('selectedSpec');
    if (selectedSpec) {
      this.setData({
        selectedSpec: selectedSpec
      });
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
    this.initSpecs();
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
   * 初始化规格数据
   */
  async initSpecs() {
    wx.showLoading({
      title: '加载中...'
    });

    try {
      // 调用云函数获取规格列表
      const result = await wx.cloud.callFunction({
        name: 'getSpecs',
        data: {
          action: 'list'
        }
      });

      if (result.result.code === 0) {
        this.setData({
          specs: result.result.data
        });
      } else {
        // 如果云函数调用失败，使用默认规格
        const defaultSpecs = [
          {
            id: 1,
            name: '一寸',
            width_mm: 25,
            height_mm: 35,
            dpi: 300,
            pixel_width: 295,
            pixel_height: 413
          },
          {
            id: 2,
            name: '二寸',
            width_mm: 35,
            height_mm: 49,
            dpi: 300,
            pixel_width: 413,
            pixel_height: 579
          },
          {
            id: 3,
            name: '护照',
            width_mm: 33,
            height_mm: 48,
            dpi: 300,
            pixel_width: 390,
            pixel_height: 567
          },
          {
            id: 4,
            name: '签证',
            width_mm: 35,
            height_mm: 45,
            dpi: 300,
            pixel_width: 413,
            pixel_height: 531
          }
        ];
        this.setData({
          specs: defaultSpecs
        });
      }
    } catch (error) {
      console.error('获取规格列表失败:', error);
      // 使用默认规格
      const defaultSpecs = [
        {
          id: 1,
          name: '一寸',
          width_mm: 25,
          height_mm: 35,
          dpi: 300,
          pixel_width: 295,
          pixel_height: 413
        },
        {
          id: 2,
          name: '二寸',
          width_mm: 35,
          height_mm: 49,
          dpi: 300,
          pixel_width: 413,
          pixel_height: 579
        },
        {
          id: 3,
          name: '护照',
          width_mm: 33,
          height_mm: 48,
          dpi: 300,
          pixel_width: 390,
          pixel_height: 567
        },
        {
          id: 4,
          name: '签证',
          width_mm: 35,
          height_mm: 45,
          dpi: 300,
          pixel_width: 413,
          pixel_height: 531
        }
      ];
      this.setData({
        specs: defaultSpecs
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 选择规格
   */
  selectSpec(e) {
    const spec = e.currentTarget.dataset.spec;
    this.setData({
      selectedSpec: spec
    });
    
    // 保存选中的规格到全局存储
    wx.setStorageSync('selectedSpec', spec);
  },

  /**
   * 跳转到裁剪页面
   */
  goToCrop() {
    if (!this.data.selectedSpec) {
      wx.showToast({
        title: '请选择证件照规格',
        icon: 'none'
      });
      return;
    }

    // 检查是否已上传照片
    const uploadedImage = wx.getStorageSync('uploadedImage');
    if (!uploadedImage) {
      // 如果没有上传照片，跳转到上传页面
      wx.navigateTo({
        url: '/pages/upload/upload'
      });
      return;
    }

    // 跳转到裁剪页面
    wx.navigateTo({
      url: '/pages/cropEdit/cropEdit'
    });
  }
})