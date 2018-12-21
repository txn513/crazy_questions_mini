// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;
const userInfo = db.collection("userInfo")

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await userInfo.where({
    _openid:_.eq(event.openid)
  }).get();
  if(res.data.length > 0){
    return await userInfo.where({
      _openid: _.eq(event.openid)
    }).update({
      // data 传入需要局部更新的数据
      data: {
        appid: event.appid,
        unionid: event.unionid,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        country: event.country,
        province: event.province,
        city: event.city,
        gender: event.gender,
        updateTime: new Date(new Date().getTime())
      }
    })
  }
}