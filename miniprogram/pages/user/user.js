// miniprogram/pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 是否登录
    info: {} // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setInfo()
  },

  /**
   * 获取用户信息
   */
  onGotUserInfo(e) {
    app.globalData.isLogin = true
    app.globalData.userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      data: {
        info: e.detail.userInfo
      },
      complete: res => {
        const { errMsg, result } = res
        if (errMsg === 'cloud.callFunction:ok') {
          app.globalData.openId = result.openid
          this.setInfo()
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 设置用户信息
   */
  setInfo() {
    this.setData({
      isLogin: app.globalData.isLogin,
      info: app.globalData.userInfo
    })
  }
})