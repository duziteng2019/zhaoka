// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    page: 1,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载历史记录
    this.loadHistoryList();
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
    // 更新tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
    // 每次显示页面时重新加载历史记录
    this.setData({
      historyList: [],
      page: 1,
      hasMore: true
    });
    this.loadHistoryList();
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
    // 下拉刷新，重新加载历史记录
    this.setData({
      historyList: [],
      page: 1,
      hasMore: true
    });
    this.loadHistoryList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉加载更多历史记录
    if (this.data.hasMore) {
      this.loadHistoryList();
    }
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
   * 加载历史记录列表
   */
  loadHistoryList() {
    if (!this.data.hasMore) {
      return;
    }

    wx.showLoading({
      title: '加载中...'
    });

    // 调用getHistory云函数获取历史记录
    wx.cloud.callFunction({
      name: 'getHistory',
      data: {
        page: this.data.page,
        limit: 10
      },
      success: res => {
        console.log('获取历史记录成功', res);
        const historyList = res.result.data.historyList;
        const newHistoryList = [...this.data.historyList, ...historyList];
        
        this.setData({
          historyList: newHistoryList,
          page: this.data.page + 1,
          hasMore: historyList.length === 10
        });
        
        // 格式化历史记录数据
        this.formatHistoryData();
        
        wx.hideLoading();
      },
      fail: err => {
        console.error('获取历史记录失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 格式化历史记录数据
   */
  formatHistoryData() {
    const formattedList = this.data.historyList.map(item => {
      // 格式化日期
      const createTime = new Date(item.create_time);
      const formattedDate = `${createTime.getFullYear()}-${(createTime.getMonth() + 1).toString().padStart(2, '0')}-${createTime.getDate().toString().padStart(2, '0')} ${createTime.getHours().toString().padStart(2, '0')}:${createTime.getMinutes().toString().padStart(2, '0')}`;
      
      // 获取背景颜色名称
      const bgColorName = this.getBgColorName(item.bgColor);
      
      return {
        ...item,
        createTime: formattedDate,
        bgColorName: bgColorName
      };
    });
    
    this.setData({
      historyList: formattedList
    });
  },

  /**
   * 根据颜色值获取颜色名称
   */
  getBgColorName(color) {
    const colorMap = {
      '#FFFFFF': '白色',
      '#4A90E2': '蓝色',
      '#E74C3C': '红色'
    };
    return colorMap[color] || '自定义';
  },

  /**
   * 查看历史记录详情
   */
  viewHistoryDetail(e) {
    const history = e.currentTarget.dataset.history;
    // 保存当前历史记录到全局存储
    wx.setStorageSync('currentHistory', history);
    // 跳转到历史详情页
    wx.navigateTo({
      url: '/pages/historyDetail/historyDetail'
    });
  },

  /**
   * 编辑历史记录
   */
  editHistory(e) {
    const history = e.currentTarget.dataset.history;
    // 保存当前历史记录到全局存储
    wx.setStorageSync('editHistory', history);
    // 跳转到裁剪页面进行编辑
    wx.navigateTo({
      url: '/pages/cropEdit/cropEdit?editMode=true'
    });
  },

  /**
   * 删除历史记录
   */
  deleteHistory(e) {
    const historyId = e.currentTarget.dataset.historyId;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条历史记录吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...'
          });
          
          // 调用deleteHistory云函数删除历史记录
          wx.cloud.callFunction({
            name: 'deleteHistory',
            data: {
              historyId: historyId
            },
            success: res => {
              console.log('删除历史记录成功', res);
              wx.hideLoading();
              // 重新加载历史记录
              this.setData({
                historyList: [],
                page: 1,
                hasMore: true
              });
              this.loadHistoryList();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
            },
            fail: err => {
              console.error('删除历史记录失败', err);
              wx.hideLoading();
              wx.showToast({
                title: '删除失败，请重试',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 创建新证件照
   */
  createNew() {
    // 清除之前的缓存数据
    wx.removeStorageSync('uploadedImage');
    wx.removeStorageSync('croppedImage');
    wx.removeStorageSync('finalImage');
    
    // 跳转到首页
    wx.navigateTo({
      url: '/pages/home/home'
    });
  }
})