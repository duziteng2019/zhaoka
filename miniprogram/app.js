// app.js — 精简版
App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      env: 'cloud1-2ge2s3ln9adb1998',
      traceUser: true
    })
    this.autoLogin()
  },

  autoLogin() {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        if (res.result && res.result.openid) {
          this.globalData.openid = res.result.openid
        }
      },
      fail: () => {}
    })
  }
})
