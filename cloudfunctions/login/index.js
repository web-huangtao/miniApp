// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  return await db.collection('user').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      openId: wxContext.OPENID,
      userInfo: event.info
    }
  }).then(res => {
    return {
      openId: wxContext.OPENID,
      userInfo: event.info,
      msg: '登录成功'
    }
  }).catch(err => {
    return {
      msg: '登录失败'
    }
  })
}
