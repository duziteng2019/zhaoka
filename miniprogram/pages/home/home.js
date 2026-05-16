// pages/home/home.js
Page({
  data: {
    specs: [],
    loadingSpecs: true,
    selectedSpec: null,
    // 上传区
    tempFilePath: '',
    uploading: false,
    // 处理区
    processing: false,
    processed: false,
    resultPreview: '',
    resultFileID: '',
    // 视图: 'select' | 'result'
    view: 'select'
  },

  onLoad() {
    this.loadSpecs()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  // ─── 规格 ───

  async loadSpecs() {
    try {
      const res = await wx.cloud.callFunction({ name: 'getSpecs', data: {} })
      if (res.result?.code === 0 && res.result.data?.length) {
        this.setData({ specs: res.result.data, loadingSpecs: false })
        return
      }
    } catch (e) { /* 静默降级 */ }
    this.setData({
      specs: [
        { id: 1, name: '一寸', size: '25×35mm' },
        { id: 2, name: '二寸', size: '35×49mm' },
        { id: 3, name: '护照', size: '33×48mm' },
        { id: 4, name: '签证', size: '35×45mm' }
      ],
      loadingSpecs: false
    })
  },

  selectSpec(e) {
    const id = e.currentTarget.dataset.spec
    const spec = this.data.specs.find(s => s.id == id)
    if (!spec) return
    this.setData({ selectedSpec: spec })
    // 直接进入拍照/选照片
    this.chooseImage()
  },

  // ─── 上传 ───

  chooseImage() {
    wx.showActionSheet({
      itemList: ['相册选择', '拍照'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['album'] : ['camera']
        this.pickAndProcess(sourceType)
      }
    })
  },

  async pickAndProcess(sourceType) {
    try {
      const res = await wx.chooseImage({ count: 1, sizeType: ['compressed'], sourceType })
      const path = res.tempFilePaths[0]
      this.setData({ tempFilePath: path, view: 'result', processing: true })

      // 上传到云存储
      wx.showLoading({ title: '上传中...' })
      const up = await wx.cloud.uploadFile({
        cloudPath: `input/${Date.now()}.jpg`,
        filePath: path
      })
      wx.hideLoading()

      // 自动处理
      wx.showLoading({ title: '处理中...' })
      const proc = await wx.cloud.callFunction({
        name: 'processPhoto',
        data: {
          action: 'preview',
          fileID: up.fileID,
          bgColor: 'white',
          specWidth: this.data.selectedSpec?.width || 25,
          specHeight: this.data.selectedSpec?.height || 35
        }
      })

      if (proc.result?.code === 0) {
        this.setData({
          resultPreview: proc.result.data.preview,
          resultFileID: up.fileID,
          processed: true,
          processing: false
        })
        wx.hideLoading()
      } else {
        throw new Error(proc.result?.message || '处理失败')
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '处理失败', icon: 'none' })
      this.setData({ processing: false })
    }
  },

  // ─── 切换背景色 ───

  switchColor(e) {
    const color = e.currentTarget.dataset.color
    const spec = this.data.selectedSpec
    this.setData({ selectedBg: color, processing: true })

    wx.showLoading({ title: '处理中...' })
    wx.cloud.callFunction({
      name: 'processPhoto',
      data: {
        action: 'preview',
        fileID: this.data.resultFileID,
        bgColor: color,
        specWidth: spec?.width || 25,
        specHeight: spec?.height || 35
      },
      success: (res) => {
        if (res.result?.code === 0) {
          this.setData({ resultPreview: res.result.data.preview, processing: false })
        }
        wx.hideLoading()
      },
      fail: () => { wx.hideLoading(); this.setData({ processing: false }) }
    })
  },

  // ─── 导出 ───

  goExport() {
    if (!this.data.resultPreview) {
      wx.showToast({ title: '请先制作证件照', icon: 'none' })
      return
    }
    wx.setStorageSync('finalImage', {
      previewUrl: this.data.resultPreview,
      fileID: this.data.resultFileID,
      spec: this.data.selectedSpec,
      bgColor: 'white'
    })
    wx.navigateTo({ url: '/pages/export/export' })
  },

  // ─── 重新开始 ───

  reset() {
    this.setData({
      tempFilePath: '', resultPreview: '', resultFileID: '',
      processed: false, processing: false, view: 'select', selectedSpec: null
    })
  },

  // 快捷入口
  startCreate() { /* 不选规格直接进，默认一寸 */
    this.setData({ selectedSpec: { id: 1, name: '一寸', size: '25×35mm', width: 25, height: 35 } })
    this.chooseImage()
  },

  onShareAppMessage() {
    return { title: '证件照制作', path: '/pages/home/home' }
  }
})
