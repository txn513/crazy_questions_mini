// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;
const rushRecords = db.collection("rushRecords");
const userInfo = db.collection("userInfo");

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await rushRecords.field({
    _id:false,
    createTime:true,
    updateTime:true,
    newestRecord:true,
    topRecord:true
  }).where({
    _openid: _.eq(event.openid)
  }).get();
  const result = await userInfo.field({
    _id: false,
    errorSum: true,
    correntSum: true,
    accuracyRate: true
  }).where({
    _openid: _.eq(event.openid)
  }).get();
  const resultObj = {};
  resultObj.code = 200;
  resultObj.msg = "获取用户和闯关记录成功";
  resultObj.data = {
    rushRecords: res.data[0],
    userInfo: result.data[0]
  };
  return resultObj;
}