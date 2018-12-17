// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const userInfo = db.collection("userInfo")

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const res = await userInfo.where({
      _openid: event.openid // 填入当前用户 openid
    }).get();
    console.log(res);
    if (res.data.length != 0) {
      const resultObj = {};
      resultObj.code = 201;
      resultObj.msg = "该用户已存在！";
      return resultObj;
    } else {
      return await userInfo.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _openid: event.openid,
          appid: event.appid,
          unionid: event.unionid,
          createTime: new Date(new Date().getTime())
        }
      })
    }
  } catch (e) {
    const resultObj = {};
    resultObj.code = 203;
    resultObj.msg = "添加用户信息失败！";
    return resultObj;
  }
}