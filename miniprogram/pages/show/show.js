// miniprogram/pages/show/show.js
const innerAudioContext = wx.createInnerAudioContext()
let temper

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMusic: true,
    show1: true,
    show2: false,
    show3: false,
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.playMusic()
  },

  /**
   * 音乐循环播放
   */
  playMusic() {
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'cloud://ht-test.6874-ht-test/music/1.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onEnded((res) => {
      this.playMusic()
    })
  },

  /**
   * 播放|暂停音乐
   */
  playOrPause() {
    this.setData({
      isMusic: !this.data.isMusic
    })
    const { isMusic } = this.data

    if (isMusic) {
      innerAudioContext.play()
      innerAudioContext.onEnded((res) => {
        this.playMusic()
      })
    } else {
      innerAudioContext.pause()
    }
  },

  /**
   * 文字打印机
   */
  text() {
    const text = '胜日寻芳泗水滨 无边光景一时新 等闲识得东风面 万紫千红总是春 '
    let i = 0;
    temper = setInterval(() => {
      let poetry = text.substring(0, i)
      i++
      this.setData({
        poetry: poetry
      })
      if (i > text.length) {
        clearInterval(temper)
      }
    }, 300)
  },

  /**
   * 切换页面
   */
  changePage(e) {
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