//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    this.isLogin()
  },

  /**
   * 判断是否登录，并返回数据
   */
  isLogin() {
    wx.cloud.callFunction({
      name: 'isLogin',
      data: {},
      complete: res => {
        const { errMsg, result } = res
        console.log(res)
        if (errMsg === 'cloud.callFunction:ok') {
          console.log(result)
          // app.globalData.openId = result.openid
        } else {
          wx.showToast({
            title: '哎呀，网络开个小差~',
            icon: 'none'
          })
        }
      }
    })
  }
})
