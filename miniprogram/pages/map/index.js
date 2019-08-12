// miniprogram/pages/map/index.js
var QQMapWX = require('../../static/js/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0, // 经度
    latitude: 0, // 纬度
    scale: 16, // 缩放比例
    markers: [], // 添加标注
    polyline: [], // 路线
    currentCity: '', // 当前城市
    currentPosition: '', // 当前位置
    startPositionText: '我的位置', // 开始位置文案显示
    startPosition: '', // 开始位置
    endPosition: '', // 结束位置
    startLongitude: 0, // 开始经度
    startLatitude: 0, // 开始纬度
    endLongitude: 0, // 结束经度
    endLatitude: 0, // 结束纬度
    isLine: false, // 是否显示路线
    steps: [], // 路线步骤
    activeNames: ['1'] // 折叠面板
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
          longitude: res.longitude,
          startLatitude: res.latitude,
          startLongitude: res.longitude
        })
        // 当前位置经纬度解析地址
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            this.setData({
              currentCity: res.result.address_component.city,
              currentPosition: res.result.address,
              startPosition: res.result.address
            })
          }
        })
      }
    })
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },

  /**
   * 获取出发地
   */
  getStartPosition(e) {
    this.setData({
      startPositionText: e.detail.value,
      startPosition: e.detail.value
    })
    const { startPositionText } = this.data
    if (startPositionText !== '我的位置' && e.detail.value) {
      this.analysis(e.detail.value).then(res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          startLatitude: res.latitude,
          startLongitude: res.longitude
        })
      })
    }
  },

  /**
   * 获取目的地
   */
  getEndPosition(e) {
    this.setData({
      endPosition: e.detail.value
    })
    if (e.detail.value) {
      this.analysis(e.detail.value).then(res => {
        this.setData({
          endLatitude: res.latitude,
          endLongitude: res.longitude
        })
      })
    }
  },

  /**
   * 地址解析经纬度
   */
  analysis(destination) {
    const { currentCity } = this.data
    return new Promise((resolve, reject) => {
      qqmapsdk.geocoder({
        address: destination,
        success: res => {
          var res = res.result
          var latitude = res.location.lat
          var longitude = res.location.lng
          resolve({
            latitude: res.location.lat,
            longitude: res.location.lng,
            title: res.title
          })
        },
        fail: err => {
          console.log(err)
          reject(err)
        }
      })
    })
  },

  /**
   * 确定按钮
   */
  sure() {
    const { startLatitude, startLongitude, endLatitude, endLongitude } = this.data
    this.setData({
      scale: 13,
      markers: [{
        id: 0,
        latitude: startLatitude,
        longitude: startLongitude,
        iconPath: '/images/icon/start.png',//图标路径
        width: 32,
        height: 32
      }, {
        id: 1,
        latitude: endLatitude,
        longitude: endLongitude,
        iconPath: '/images/icon/end.png',//图标路径
        width: 32,
        height: 32
      }]
    })
    this.line()
  },

  /**
   * 切换方式
   */
  changeType(e) {
    let val = e.detail.index
    switch(val) {
      case 0:
        this.line('driving')
        break;
      case 1:
        this.line('transit')
        break;
      case 2:
        this.line('bicycling')
        break;
      case 3:
        this.line('walking')
        break;
    }
  },

  /**
   * 路线规划
   */
  line(type) {
    const { startLatitude, startLongitude, endLatitude, endLongitude } = this.data
    qqmapsdk.direction({
      mode: type ? type : '', // 可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      from: {
        latitude: startLatitude,
        longitude: startLongitude
      },
      to: {
        latitude: endLatitude,
        longitude: endLongitude
      },
      policy: type === 'transit' ? 'LEAST_TRANSFER' : '',
      success: res => {
        console.log(res.result.routes)
        if (type === 'transit') {
          this.setData({
            steps: res.result.routes[0].steps,
            polyline: []
          })
          return
        }
        var coors = res.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        this.setData({
          isLine: true,
          steps: res.result.routes[0].steps,
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
  },

  /**
   * 打开折叠面板
   */
  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  }
})