// pages/export/export.js
const cloudManager = require('../../utils/enhancedCloud')

Page({

  data: {
    previewUrl: '',
    specName: '',
    bgColorName: '',
    finalImageId: '',
    selectedSpec: null,
    selectedOption: 'free',
    hdPrice: 9.9,
    isDownloading: false
  },

  onLoad(options) {
    const finalImage = wx.getStorageSync('finalImage')
    if (!finalImage) {
      wx.navigateTo({ url: '/pages/backgroundReplace/backgroundReplace' })
      return
    }

    const selectedSpec = wx.getStorageSync('selectedSpec')
    if (!selectedSpec) {
      wx.navigateTo({ url: '/pages/sizeSelect/sizeSelect' })
      return
    }

    const bgColorName = this.getBgColorName(finalImage.bgColor)

    this.setData({
      previewUrl: finalImage.previewUrl,
      finalImageId: finalImage.finalImageId,
      finalImage: finalImage,
      selectedSpec: selectedSpec,
      specName: selectedSpec.name,
      bgColorName: bgColorName,
    })
  },

  getBgColorName(color) {
    const colorMap = {
      '#FFFFFF': '白色', '#4A90E2': '蓝色', '#E74C3C': '红色',
      white: '白色', blue: '蓝色', red: '红色'
    }
    return colorMap[color] || '自定义'
  },

  // ─── 免费低清带水印 ───
  async downloadFree() {
    if (this.data.isDownloading) return
    this.setData({ isDownloading: true })
    wx.showLoading({ title: '生成预览版...' })

    try {
      const res = await wx.cloud.callFunction({
        name: 'replaceBackground',
        data: {
          action: 'watermark',
          bgColor: this.data.finalImage?.bgColor || 'white',
          imageUrl: this.data.finalImage?.previewUrl || this.data.previewUrl
        }
      })

      if (res.result && res.result.code === 0) {
        const fileID = res.result.data.fileID
        const dl = await wx.cloud.downloadFile({ fileID })
        await this.saveImageToAlbum(dl.tempFilePath)
        // 免费下载也存历史（标记为free）
        this.saveHistory('free')
      } else {
        wx.showToast({ title: '生成失败', icon: 'none' })
      }
    } catch (err) {
      console.error('免费下载失败:', err)
      wx.showToast({ title: '下载失败', icon: 'none' })
    }

    wx.hideLoading()
    this.setData({ isDownloading: false })
  },

  // ─── 付费高清 ───
  async downloadPremium() {
    if (this.data.isDownloading) return
    this.setData({ isDownloading: true })
    wx.showLoading({ title: '创建订单...' })

    try {
      const result = await cloudManager.createOrderItem({
        specId: this.data.selectedSpec?.id || '',
        imageId: this.data.finalImageId
      })

      if (result.code !== 0) {
        throw new Error(result.message || '创建订单失败')
      }

      const orderData = result.data
      const payResult = await cloudManager.initiatePayment({
        orderId: orderData.orderId,
        orderNo: orderData.orderNo
      })

      if (payResult.code !== 0) {
        throw new Error(payResult.message || '支付功能暂未开通')
      }

      const payParams = payResult.data.payParams
      await this.requestPayment(payParams, orderData)

      // 支付成功 → 下载原图 + 存历史
      await this.downloadHighResImage()
      this.saveHistory('paid')
    } catch (err) {
      console.error('高清下载失败:', err)
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }

    wx.hideLoading()
    this.setData({ isDownloading: false })
  },

  requestPayment(payParams, orderData) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: resolve,
        fail: (err) => {
          wx.showToast({ title: '支付取消', icon: 'none' })
          reject(err)
        }
      })
    })
  },

  // 只有支付成功后才存历史
  saveHistory(downloadType) {
    const data = this.data
    wx.cloud.callFunction({
      name: 'saveHistory',
      data: {
        spec: data.selectedSpec ? { name: data.selectedSpec.name } : {},
        originalFileID: '',
        finalFileID: data.finalImageId || '',
        bgColor: data.finalImage?.bgColor || 'white',
        downloadType: downloadType,
        paidAt: downloadType === 'paid' ? new Date().toISOString() : null
      },
      success: () => console.log('历史保存成功'),
      fail: (err) => console.error('历史保存失败', err)
    })
  },

  async downloadHighResImage() {
    wx.showLoading({ title: '下载高清图片...' })
    try {
      const res = await wx.cloud.downloadFile({ fileID: this.data.finalImageId })
      await this.saveImageToAlbum(res.tempFilePath)
    } catch (err) {
      console.error('高清下载失败:', err)
      wx.showToast({ title: '下载失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  selectOption(e) {
    this.setData({ selectedOption: e.currentTarget.dataset.option })
  },

  goHome() {
    wx.reLaunch({ url: '/pages/home/home' })
  },

  download() {
    if (this.data.selectedOption === 'free') {
      this.downloadFree()
    } else {
      this.downloadPremium()
    }
  },

  saveImageToAlbum(filePath) {
    return new Promise((resolve) => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          wx.showToast({ title: '已保存到相册', icon: 'success' })
          resolve(true)
        },
        fail: (err) => {
          if (err.errMsg.indexOf('auth deny') !== -1) {
            wx.showToast({ title: '请开启相册权限', icon: 'none' })
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  this.saveImageToAlbum(filePath).then(resolve)
                }
              }
            })
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' })
            resolve(false)
          }
        }
      })
    })
  }
})
