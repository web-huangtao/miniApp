// miniprogram/pages/map/index.js
var QQMapWX = require('../../static/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    scale: 16,
    markers: [],
    polyline: [],
    destination: '' // 目的地
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'CLQBZ-AIXKS-HVUOV-655PQ-LTRNE-7UFJG'
    });
    wx.getLocation({
      type: 'wgs84', 
      success: res => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            console.log(res)
          }
        })
      }
    })
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  regionchange(e) {
    // console.log(e)
  },

  /**
   * 获取目的地
   */
  getDestination(e) {
    this.setData({
      destination: e.detail.value
    })
  },

  /**
   * 解析地址，地图标注
   */
  analysis() {
    const { destination } = this.data
    qqmapsdk.geocoder({
      address: destination,
      success: res => {
        var res = res.result
        var latitude = res.location.lat
        var longitude = res.location.lng
        var pl = [{ 
          latitude: this.data.latitude, 
          longitude: this.data.longitude 
        }, {
          latitude: latitude, 
          longitude: longitude
        }]
        this.setData({
          scale: 14,
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '',//图标路径
            width: 20,
            height: 20
          }],
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})