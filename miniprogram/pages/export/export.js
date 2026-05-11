const cloudManager = require('../../utils/enhancedCloud')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewUrl: '',
    specName: '',
    bgColorName: '',
    finalImageId: '',
    selectedSpec: null,
    finalImage: null,
    selectedOption: 'free',
    hdPrice: 9.9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取最终图片信息
    const finalImage = wx.getStorageSync('finalImage');
    if (!finalImage) {
      wx.navigateTo({ url: '/pages/backgroundReplace/backgroundReplace' });
      return;
    }

    // 获取选中的规格
    const selectedSpec = wx.getStorageSync('selectedSpec');
    if (!selectedSpec) {
      wx.navigateTo({ url: '/pages/sizeSelect/sizeSelect' });
      return;
    }

    // 获取编辑模式和历史记录ID
    const editHistory = wx.getStorageSync('editHistory');
    const editHistoryId = editHistory ? editHistory._id : null;

    // 获取背景颜色名称
    const bgColorName = this.getBgColorName(finalImage.bgColor);

    this.setData({
      previewUrl: finalImage.previewUrl,
      finalImageId: finalImage.finalImageId,
      finalImage: finalImage,
      selectedSpec: selectedSpec,
      specName: selectedSpec.name,
      bgColorName: bgColorName,
      editHistoryId: editHistoryId
    });

    // 保存历史记录
    this.saveHistory();
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
   * 保存历史记录
   */
  saveHistory() {
    wx.cloud.callFunction({
      name: 'saveHistory',
      data: {
        spec: this.data.selectedSpec ? { name: this.data.selectedSpec.name } : {},
        originalFileID: '',
        croppedFileID: '',
        finalFileID: this.data.finalImageId,
        bgColor: this.data.finalImage ? this.data.finalImage.bgColor : 'white'
      },
      success: res => {
        console.log('保存历史记录成功', res);
      },
      fail: err => {
        console.error('保存历史记录失败', err);
      }
    });
  },

  /**
   * 免费低清下载
   */
  downloadFree() {
    wx.showLoading({
      title: '下载中...'
    });

    // 调用下载API获取临时URL
    wx.cloud.downloadFile({
      fileID: this.data.finalImageId,
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
   * 付费高清下载
   */
  async downloadPremium() {
    wx.showLoading({ title: '创建订单...' })
    try {
      const result = await cloudManager.createOrderItem({
        specId: this.data.selectedSpec ? this.data.selectedSpec.id : '',
        imageId: this.data.finalImageId
      })

      if (result.code !== 0) {
        wx.hideLoading()
        wx.showToast({ title: result.message || '创建订单失败', icon: 'none' })
        return
      }

      const orderData = result.data
      await this.generatePayParams(orderData)
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '创建订单失败，请重试', icon: 'none' })
    }
  },

  /**
   * 生成支付参数
   */
  async generatePayParams(orderData) {
    wx.showLoading({ title: '获取支付参数...' })
    try {
      const result = await cloudManager.initiatePayment({
        orderId: orderData.orderId,
        orderNo: orderData.orderNo
      })

      if (result.code !== 0) {
        wx.hideLoading()
        wx.showToast({ title: result.message || '支付功能暂未开通', icon: 'none' })
        return
      }

      const payParams = result.data.payParams
      await this.requestPayment(payParams, orderData)
      wx.hideLoading()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '获取支付参数失败', icon: 'none' })
    }
  },

  /**
   * 调用微信支付
   */
  requestPayment(payParams, orderData) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: (res) => {
          this.downloadHighResImage()
          resolve(res)
        },
        fail: (err) => {
          wx.showToast({ title: '支付失败，请重试', icon: 'none' })
          reject(err)
        }
      })
    })
  },

  /**
   * 下载高清图片
   */
  downloadHighResImage() {
    wx.showLoading({
      title: '下载高清图片...'
    });

    // 直接下载高清图片（实际项目中可以根据需要添加高清图片处理逻辑）
    wx.cloud.downloadFile({
      fileID: this.data.finalImageId,
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
   * 选择下载选项
   */
  selectOption(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({ selectedOption: option });
  },

  /**
   * 返回首页
   */
  goHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  },

  /**
   * 下载 - 根据选项调用不同方法
   */
  download() {
    if (this.data.selectedOption === 'free') {
      this.downloadFree();
    } else {
      this.downloadPremium();
    }
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
  }
})