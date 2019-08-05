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
    current: 0,
    list: [{
      nickName: '哈哈',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLhxd1cN1QqqVFoXaD2lVvribtWhywckvJOOYDib25NQyW1LENG6csEXCcS1k3uQmmlm9ytiaXVdaKVQ/132',
      msg: '抢沙发'
    }, {
      nickName: '嘿嘿',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLhxd1cN1QqqVFoXaD2lVvribtWhywckvJOOYDib25NQyW1LENG6csEXCcS1k3uQmmlm9ytiaXVdaKVQ/132',
      msg: '我来评论啦'
      }, {
      nickName: '呵呵',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLhxd1cN1QqqVFoXaD2lVvribtWhywckvJOOYDib25NQyW1LENG6csEXCcS1k3uQmmlm9ytiaXVdaKVQ/132',
      msg: '我也来评论啦'
      }, {
      nickName: '哼哼',
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLhxd1cN1QqqVFoXaD2lVvribtWhywckvJOOYDib25NQyW1LENG6csEXCcS1k3uQmmlm9ytiaXVdaKVQ/132',
      msg: '来凑波热闹'
    }],
    msg: ''
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
      // console.log('开始播放')
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
   * 输入框
   */
  getMsg(e) {
    this.setData({
      msg: e.detail.value
    })
  },

  /**
   * 评论
   */
  sendMsg() {
    const { msg } = this.data
    if (msg === '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return
    }
    const params = this.data.list.concat([{
      avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLhxd1cN1QqqVFoXaD2lVvribtWhywckvJOOYDib25NQyW1LENG6csEXCcS1k3uQmmlm9ytiaXVdaKVQ/132',
      nickName: '呃呃',
      msg: this.data.msg
    }])
    this.setData({
      list: params
    })
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