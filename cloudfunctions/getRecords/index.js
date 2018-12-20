// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const trueRecords = db.collection("records");
const resultObj = {};
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  const res = await trueRecords.where({
    _openid: _.eq(event.openid)
    
  }).get();
  if (res.data.length != 0) {
    resultObj.code = 200;
    resultObj.msg = "获取成功！";
    resultObj.result = {
      count: res.data.length,
      data: res.data
    }
  } else {
    resultObj.code = 201;
    resultObj.msg = "该用户没有记录！";
    resultObj.result = {};
  }
  return resultObj;
}