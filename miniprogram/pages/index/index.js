//index.js
const app = getApp()

Page({
  data: {
    uploadDialog: false, // 上传图片弹窗
    src: '',
    width: 250, // 宽度
    height: 250, // 高度
    cutImg: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.isLogin()
  },

  /**
   * 上传图片
   */
  showDialog() {
    // 获取到image-cropper对象
    this.cropper = this.selectComponent("#image-cropper")
    this.cropper.upload()
  },
  
  /**
   * 裁剪图片
   */
  loadimage(e) {
    wx.hideLoading();
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
    this.setData({
      src: e.detail.path,
      width: 250, // 宽度
      height: 250, // 高度
      uploadDialog: true
    })
  },

  /**
   * 裁剪图片：取消按钮
   */
  cancel() {
    this.setData({
      uploadDialog: false
    })
  },

  /**
   * 裁剪图片：提交按钮
   */
  submit() {
    this.cropper.getImg((e) => {
      this.setData({
        cutImg: e.url,
        uploadDialog: false
      })
    })
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
        if (errMsg === 'cloud.callFunction:ok') {
          if (result.data.length > 0) {
            app.globalData.isLogin = true
            app.globalData.openId = result.data[0].openId
            app.globalData.userInfo = result.data[0].userInfo
          }
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
