// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
const records = db.collection("records");
// 云函数入口函数
exports.main = async (event, context) => {
  const res = await records.add({
    data:{
      _openid:event.openid,
      questioId:event.questionId,
      isTrue:event.isTrue,
      createTime: new Date(new Date().getTime())
    }
  })
  return res;
}