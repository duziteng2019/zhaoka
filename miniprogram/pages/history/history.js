// pages/history/history.js
Page({

  data: {
    historyList: [],
    leftCol: [],
    rightCol: [],
    page: 1,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadHistoryList()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    // 切换到该页面时重新加载
    this.setData({ historyList: [], leftCol: [], rightCol: [], page: 1, hasMore: true })
    this.loadHistoryList()
  },

  onPullDownRefresh() {
    this.setData({ historyList: [], leftCol: [], rightCol: [], page: 1, hasMore: true })
    this.loadHistoryList()
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadHistoryList()
    }
  },

  loadHistoryList() {
    if (!this.data.hasMore || this.data.loading) return
    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getHistory',
      data: { page: this.data.page, pageSize: 10 },
      success: res => {
        const items = (res.result && res.result.data && res.result.data.list) || []
        const formatted = items.map(item => this.formatItem(item))
        const merged = [...this.data.historyList, ...formatted]

        this.setData({
          historyList: merged,
          page: this.data.page + 1,
          hasMore: items.length === 10,
          loading: false
        })

        this.buildWaterfall(merged)
      },
      fail: err => {
        console.error('获取历史记录失败', err)
        this.setData({ loading: false })
        wx.showToast({ title: '加载失败', icon: 'none' })
      }
    })
  },

  formatItem(item) {
    const t = item.createdAt || ''
    const d = t ? new Date(t) : null
    const dateStr = d ? `${d.getMonth()+1}月${d.getDate()}日` : ''
    return {
      ...item,
      _id: item._id,
      createTime: dateStr,
      bgColorName: this.getBgColorName(item.bgColor),
      thumbUrl: item.fileID || ''
    }
  },

  // 分为两列（交替分配）
  buildWaterfall(list) {
    const left = [], right = []
    list.forEach((item, i) => {
      if (i % 2 === 0) left.push(item)
      else right.push(item)
    })
    this.setData({ leftCol: left, rightCol: right })
  },

  getBgColorName(color) {
    const map = { '#FFFFFF': '白色', '#4A90E2': '蓝色', '#E74C3C': '红色', white: '白色', blue: '蓝色', red: '红色' }
    return map[color] || '自定义'
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.historyList.find(h => h.id === id || h._id === id)
    if (item) {
      wx.setStorageSync('currentHistory', item)
      wx.navigateTo({ url: '/pages/historyDetail/historyDetail' })
    }
  },

  goHome() {
    wx.reLaunch({ url: '/pages/home/home' })
  },

  onShareAppMessage() {
    return { title: '证件照制作', path: '/pages/home/home' }
  }
})
