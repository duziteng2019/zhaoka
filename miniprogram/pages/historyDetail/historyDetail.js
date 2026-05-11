// pages/historyDetail/historyDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentHistory: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取当前历史记录
    const currentHistory = wx.getStorageSync('currentHistory');
    if (!currentHistory) {
      // 如果没有历史记录，返回上一页
      wx.navigateBack();
      return;
    }

    this.setData({
      currentHistory: currentHistory
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
   * 下载历史记录图片
   */
  downloadHistory() {
    wx.showLoading({
      title: '下载中...'
    });

    // 调用下载API获取临时URL
    wx.cloud.downloadFile({
      fileID: this.data.currentHistory.finalImageId,
      success: res => {
        // 保存图片到相册
        this.saveImageToAlbum(res.tempFilePath);
        wx.hideLoading();
      },
      fail: err => {
        console.error('下载失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '下载失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 保存图片到相册
   */
  saveImageToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: res => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('保存到相册失败', err);
        // 如果是因为权限问题，提示用户开启权限
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showToast({
            title: '请开启保存图片权限',
            icon: 'none'
          });
          // 引导用户开启权限
          wx.openSetting({
            success: settingRes => {
              if (settingRes.authSetting['scope.writePhotosAlbum']) {
                // 权限已开启，再次尝试保存
                this.saveImageToAlbum(filePath);
              }
            }
          });
        } else {
          wx.showToast({
            title: '保存失败，请重试',
            icon: 'none'
          });
        }
      }
    });
  },

  /**
   * 重新编辑历史记录
   */
  editHistory() {
    // 保存当前历史记录到全局存储
    wx.setStorageSync('editHistory', this.data.currentHistory);
    // 跳转到裁剪页面进行编辑
    wx.navigateTo({
      url: '/pages/cropEdit/cropEdit?editMode=true'
    });
  },

  /**
   * 删除历史记录
   */
  deleteHistory() {
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
              historyId: this.data.currentHistory._id
            },
            success: res => {
              console.log('删除历史记录成功', res);
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 删除成功后返回上一页
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
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
  }
})