// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;
const rushRecords = db.collection("rushRecords");
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
  return res.data[0];
}