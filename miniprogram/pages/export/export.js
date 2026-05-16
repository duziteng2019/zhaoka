// pages/export/export.js
Page({
  data: {
    previewUrl: '',
    fileID: '',
    specName: '',
    bgColorName: '白色',
    selectedOption: 'free',
    hdPrice: 4.9,
    isDownloading: false
  },

  onLoad() {
    const img = wx.getStorageSync('finalImage')
    if (!img) {
      wx.reLaunch({ url: '/pages/home/home' })
      return
    }
    this.setData({
      previewUrl: img.previewUrl || '',
      fileID: img.fileID || '',
      specName: img.spec?.name || '证件照',
      bgColorName: this.getBgName(img.bgColor)
    })
  },

  getBgName(c) {
    const m = { white: '白色', blue: '蓝色', red: '红色', '#FFFFFF': '白色', '#4A90E2': '蓝色', '#E74C3C': '红色' }
    return m[c] || '白色'
  },

  // ─── 免费：水印版 ───

  async downloadFree() {
    if (this.data.isDownloading) return
    this.setData({ isDownloading: true })
    wx.showLoading({ title: '生成预览版...' })

    try {
      const res = await wx.cloud.callFunction({
        name: 'processPhoto',
        data: { action: 'watermark', fileID: this.data.fileID, bgColor: 'white' }
      })
      if (res.result?.code !== 0) throw new Error(res.result?.message)

      const dl = await wx.cloud.downloadFile({ fileID: res.result.data.fileID })
      await this.saveToAlbum(dl.tempFilePath)
      this.saveHistory('free')
    } catch (err) {
      wx.showToast({ title: err.message || '下载失败', icon: 'none' })
    }

    wx.hideLoading()
    this.setData({ isDownloading: false })
  },

  // ─── 付费 ───

  async downloadPremium() {
    if (this.data.isDownloading) return
    this.setData({ isDownloading: true })
    wx.showLoading({ title: '创建订单...' })

    try {
      // 1. 创建订单
      const order = await wx.cloud.callFunction({
        name: 'createOrder',
        data: { action: 'create', imageId: this.data.fileID }
      })
      if (order.result?.code !== 0) throw new Error(order.result?.message || '创建订单失败')

      const { orderId, orderNo } = order.result.data

      // 2. 获取支付参数
      wx.showLoading({ title: '获取支付参数...' })
      const pay = await wx.cloud.callFunction({
        name: 'createOrder',
        data: { action: 'pay', orderId, orderNo }
      })
      if (pay.result?.code !== 0) throw new Error(pay.result?.message || '支付功能暂未开通')

      // 3. 发起支付
      wx.hideLoading()
      const { payParams } = pay.result.data
      await this.requestPayment(payParams)

      // 4. 支付成功 → 生成高清版
      wx.showLoading({ title: '生成高清版...' })
      const hd = await wx.cloud.callFunction({
        name: 'processPhoto',
        data: { action: 'hd', fileID: this.data.fileID, bgColor: 'white' }
      })
      if (hd.result?.code !== 0) throw new Error('高清版生成失败')

      const dl = await wx.cloud.downloadFile({ fileID: hd.result.data.fileID })
      await this.saveToAlbum(dl.tempFilePath)
      this.saveHistory('paid')
    } catch (err) {
      wx.hideLoading()
      if (err.errMsg?.includes('cancel')) return // 用户取消支付
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }

    this.setData({ isDownloading: false })
  },

  requestPayment(params) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType || 'MD5',
        paySign: params.paySign,
        success: resolve,
        fail: reject
      })
    })
  },

  saveHistory(type) {
    wx.cloud.callFunction({
      name: 'getHistory',
      data: { action: 'save', specName: this.data.specName, fileID: this.data.fileID, downloadType: type }
    }).catch(() => {})
  },

  saveToAlbum(path) {
    return new Promise((resolve) => {
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: () => { wx.showToast({ title: '已保存到相册', icon: 'success' }); resolve(true) },
        fail: (err) => {
          if (err.errMsg.includes('auth deny')) {
            wx.showToast({ title: '请开启相册权限', icon: 'none' })
            wx.openSetting({ success: (r) => { if (r.authSetting['scope.writePhotosAlbum']) this.saveToAlbum(path) } })
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' })
          }
          resolve(false)
        }
      })
    })
  },

  selectOption(e) { this.setData({ selectedOption: e.currentTarget.dataset.option }) },
  goHome() { wx.reLaunch({ url: '/pages/home/home' }) },
  download() {
    this.data.selectedOption === 'free' ? this.downloadFree() : this.downloadPremium()
  }
})
