// pages/backgroundReplace/backgroundReplace.js
const app = getApp()

Page({

  data: {
    previewUrl: '',
    selectedBgColor: '#FFFFFF',
    brightness: 0,
    smooth: 50,
    saturation: 0,
    finalImageId: '',
    isProcessing: false,
    useAiMode: false,
    modeLabel: '颜色检测'
  },

  onLoad(options) {
    const croppedImage = wx.getStorageSync('croppedImage')
    if (!croppedImage) {
      wx.navigateTo({ url: '/pages/cropEdit/cropEdit' })
      return
    }

    this.setData({
      previewUrl: croppedImage.previewUrl,
      fileID: croppedImage.fileID || ''
    })

    // 尝试AI分割
    this.tryAiSegment()
  },

  // 尝试AI人像分割
  async tryAiSegment() {
    const previewUrl = this.data.previewUrl
    if (!previewUrl) return

    console.log('[backgroundReplace] 尝试AI人像分割...')
    try {
      const res = await wx.cloud.callFunction({
        name: 'portraitSegment',
        data: { imageUrl: previewUrl }
      })

      if (res.result && res.result.code === 0 && res.result.data) {
        const mask = res.result.data.resultMask || res.result.data.resultImage
        if (mask) {
          this.setData({
            maskBase64: mask,
            useAiMode: res.result.data.source === 'ai',
            modeLabel: res.result.data.source === 'ai' ? '🤖 AI分割' : '⚙️ 基础分割'
          })
          console.log(`[backgroundReplace] 分割成功 (${this.data.modeLabel})`)
        }
      } else {
        console.log('[backgroundReplace] 分割返回空，用颜色检测')
      }
    } catch (err) {
      console.log('[backgroundReplace] 分割失败，降级颜色检测:', err.message)
    }

    // 获取分割结果后立即刷新预览
    this.updateBackground()
  },

  selectBg(e) {
    this.selectBgColor(e)
  },

  selectBgColor(e) {
    const color = e.currentTarget.dataset.color
    this.setData({ selectedBgColor: color })
    this.updateBackground()
  },

  onBrightnessChange(e) {
    this.setData({ brightness: e.detail.value })
    this.updateBackground()
  },

  onSmoothChange(e) {
    this.setData({ smooth: e.detail.value })
    this.updateBackground()
  },

  onSaturationChange(e) {
    this.setData({ saturation: e.detail.value })
    this.updateBackground()
  },

  updateBackground() {
    if (this.data.isProcessing) return
    this.setData({ isProcessing: true })

    wx.showLoading({ title: '处理中...' })

    const croppedImage = wx.getStorageSync('croppedImage')
    if (!croppedImage) {
      wx.hideLoading()
      this.setData({ isProcessing: false })
      return
    }

    wx.cloud.callFunction({
      name: 'replaceBackground',
      data: {
        imageUrl: croppedImage.previewUrl,
        bgColor: this.data.selectedBgColor,
        maskBase64: this.data.maskBase64 || '',
        beautyParams: {
          brightness: this.data.brightness,
          smooth: this.data.smooth,
          saturation: this.data.saturation
        }
      },
      success: res => {
        console.log('背景替换成功', res.result)
        if (res.result && res.result.code === 0) {
          this.setData({
            previewUrl: res.result.data.preview,
            finalImageId: res.result.data.fileID || '',
          })
        }
        wx.hideLoading()
        this.setData({ isProcessing: false })
      },
      fail: err => {
        console.error('背景替换失败', err)
        wx.hideLoading()
        wx.showToast({ title: '处理失败，请重试', icon: 'none' })
        this.setData({ isProcessing: false })
      }
    })
  },

  goBack() {
    wx.navigateBack()
  },

  goNext() {
    this.goToExport()
  },

  goToExport() {
    if (!this.data.finalImageId && !this.data.previewUrl) {
      wx.showToast({ title: '请先完成背景替换', icon: 'none' })
      return
    }

    wx.setStorageSync('finalImage', {
      previewUrl: this.data.previewUrl,
      finalImageId: this.data.finalImageId,
      bgColor: this.data.selectedBgColor,
      beautyParams: {
        brightness: this.data.brightness,
        smooth: this.data.smooth,
        saturation: this.data.saturation
      }
    })

    wx.navigateTo({ url: '/pages/export/export' })
  }
})
