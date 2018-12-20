// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;
const rushRecords = db.collection("rushRecords");
// 云函数入口函数
exports.main = async (event, context) => {
  const res = rushRecords.where({
    _openid: _.eq(event.openId)
  }).get();
  return res;
}