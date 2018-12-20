// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
const records = db.collection("records");
let errCount = 0;
let correctCount = 0;
let recordId = '';
// 云函数入口函数
exports.main = async(event, context) => {
  //判断该用户是否有答题记录
  const res = await records.where({
    _openid: event.openid,
    questionId: event.questionId
  }).get();
  correctCount = res.data.length > 0 ? res.data[0].correctCount : correctCount;
  errCount = res.data.length > 0 ? res.data[0].errCount : errCount;
  recordId = res.data.length > 0 ? res.data[0]._id : recordId;
  if (res.data.length > 0) {
    const res = await records.doc(recordId).update({
      data: {
        correctCount: event.isTrue ? _.inc(1) : correctCount,
        errCount: event.isTrue ? errCount : _.inc(1),
        updateTime: new Date(new Date().getTime())
      }
    })
    return res;
  } else {
    const res = await records.add({
      data: {
        _openid: event.openid,
        questionId: event.questionId,
        correctCount: event.isTrue ? 1 : 0,
        errCount: event.isTrue ? 0 : 1,
        createTime: new Date(new Date().getTime()),
        updateTime: new Date(new Date().getTime())
      }
    })
    return res;
  }
}