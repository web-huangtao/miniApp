// miniprogram/pages/show/show.js
let temper,
  n = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: true,
    show2: false,
    show3: false,
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.upIcon()
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'cloud://ht-test.6874-ht-test/music/1.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onEnded((res) => {
      console.log(res)
      innerAudioContext.onPlay()
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 向上箭头动画
   */
  upIcon() {
    const animation = wx.createAnimation({
      duration: 800,
    })
    temper = setInterval(() => {
      animation.bottom(20).opacity(0).step({
        timingFunction: 'ease-out'
      })
      animation.bottom(10).opacity(1).step({ duration: 0 })
      this.setData({
        upIcon: animation.export()
      })
    }, 500)
  },

  /**
   * 切换页面
   */
  changePage(e) {
    this.upIcon()
    if (e.detail.source === 'touch') {
      const idx = e.detail.current
      this.setData({
        current: idx
      })
      if (idx === 0) {
        this.setData({
          show1: true,
          show2: false
        })
      } else {
        this.setData({
          show1: false,
          show2: true
        })
      }
    }
  }
})