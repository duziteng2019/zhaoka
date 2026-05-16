// pages/cropEdit/cropEdit.js
Page({

  data: {
    tempFilePath: '',
    fileID: '',
    faceRect: null,
    detecting: false,
    offsetY: 0,
    zoom: 100,
    autoCropped: false,
    croppedImageId: '',
  },

  onLoad(options) {
    const uploadInfo = wx.getStorageSync('uploadInfo') || {}
    const tempFilePath = uploadInfo.tempFilePath || ''

    if (!tempFilePath) {
      wx.navigateTo({ url: '/pages/upload/upload' })
      return
    }

    this.setData({ tempFilePath, fileID: uploadInfo.fileID || '' })

    // 自动检测人脸
    this.autoCrop()
  },

  async autoCrop() {
    this.setData({ detecting: true })

    try {
      const res = await wx.cloud.callFunction({
        name: 'faceDetect',
        data: {
          imageUrl: this.data.tempFilePath
        }
      })

      if (res.result && res.result.code === 0 && res.result.data) {
        const face = res.result.data.faceRect
        if (face && face.width > 0) {
          // 拿到原始图尺寸（从云函数返回或从图片信息获取）
          const imgInfo = await this.getImageInfo(this.data.tempFilePath)
          const scaleX = imgInfo.width / 750  // 微信rpx转换参考
          const scaleY = imgInfo.height / 750

          this.setData({
            faceRect: {
              x: face.x * scaleX,
              y: face.y * scaleY,
              width: face.width * scaleX,
              height: face.height * scaleY,
            },
            detecting: false,
            autoCropped: true,
            imgWidth: imgInfo.width,
            imgHeight: imgInfo.height,
          })

          // 保存裁剪结果
          wx.setStorageSync('croppedImage', {
            previewUrl: this.data.tempFilePath,
            fileID: this.data.fileID,
            faceRect: this.data.faceRect
          })
          return
        }
      }
    } catch (err) {
      console.log('[cropEdit] 自动检测失败:', err.message)
    }

    // 降级：用整个图片
    this.setData({
      detecting: false,
      autoCropped: true,
    })

    wx.setStorageSync('croppedImage', {
      previewUrl: this.data.tempFilePath,
      fileID: this.data.fileID,
    })
  },

  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success: resolve,
        fail: reject
      })
    })
  },

  resetCrop() {
    this.setData({ faceRect: null, offsetY: 0, zoom: 100 })
    this.autoCrop()
  },

  onOffsetY(e) {
    this.setData({ offsetY: e.detail.value })
  },

  onZoom(e) {
    this.setData({ zoom: e.detail.value })
  },

  goBack() {
    wx.navigateBack()
  },

  goNext() {
    if (!this.data.autoCropped) {
      wx.showToast({ title: '请先完成裁剪', icon: 'none' })
      return
    }

    wx.navigateTo({ url: '/pages/backgroundReplace/backgroundReplace' })
  }
})
