// pages/home/home.js
Page({

  data: {
    specs: [
      { id: 1, name: '一寸', size: '25×35mm' },
      { id: 2, name: '二寸', size: '35×49mm' },
      { id: 3, name: '护照', size: '33×48mm' },
      { id: 4, name: '签证', size: '35×45mm' }
    ],
    loadingSpecs: true
  },

  onLoad(options) {
    this.loadSpecs()
  },

  async loadSpecs() {
    try {
      const res = await wx.cloud.callFunction({ name: 'getSpecs', data: {} })
      if (res.result && res.result.code === 0 && res.result.data && res.result.data.length > 0) {
        this.setData({ specs: res.result.data, loadingSpecs: false })
        console.log(`[Home] 从云端加载${res.result.data.length}个规格`)
        return
      }
    } catch (err) {
      console.log('[Home] 云端规格加载失败，使用本地默认:', err.message)
    }
    this.setData({ loadingSpecs: false })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onShareAppMessage() {
    return {
      title: '证件照制作',
      path: '/pages/home/home'
    }
  },

  selectSpec(e) {
    const specId = e.currentTarget.dataset.spec
    const spec = this.data.specs.find(s => s.id == specId)
    if (!spec) return

    wx.setStorageSync('selectedSpec', spec)

    wx.navigateTo({
      url: '/pages/upload/upload'
    })
  },

  startCreate() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    })
  }
})
