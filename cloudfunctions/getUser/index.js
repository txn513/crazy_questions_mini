// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const userInfo = db.collection("userInfo")
const resultObj = {};
// 云函数入口函数
exports.main = async(event, context) => {
  const res = await userInfo.where({
    _openid: event.openid // 填入当前用户 openid
  }).get();
  console.log(res);
  if (res != null) {
    resultObj.code = 201;
    resultObj.msg = "该用户已存在！";
    resultObj.data = res;
    return resultObj;
  }
    resultObj.code = 200;
    resultObj.msg = "该用户可添加！";
    return resultObj;
}