// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
const records = db.collection("records");
const rushRecords = db.collection("rushRecords");
const userInfo = db.collection("userInfo");
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

  //判断是否有闯关记录
  const result = await rushRecords.where({
    _openid: _.eq(event.openid)
  }).get();
  let rushRecordId = result.data.length > 0 ? result.data[0]._id : '';
  if (res.data.length > 0) {
    //判断用户是否有答题记录，如果存在，则更新答对答错数据统计
    const res = await records.doc(recordId).update({
      data: {
        correctCount: event.isTrue ? _.inc(1) : correctCount,
        errCount: event.isTrue ? errCount : _.inc(1),
        updateTime: new Date(new Date().getTime())
      }
    })
    //判断用户是否有闯关记录，如果有，则更新最近记录
    const rush = await rushRecords.doc(rushRecordId).update({
      data: {
        newestRecord: event.rushRecord,
        updateTime: new Date(new Date().getTime())
      }
    })
    return rush;
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
    if (res._id) {
      const res = await userInfo.where({
        _openid: event.openid,
      }).update({
          data: {
            answerCount: _.inc(1),
            errorSum: event.errorSum,
            correntSum: event.correntSum,
            accuracyRate: event.accuracyRate,
            updateTime: new Date(new Date().getTime())
          }
        })
    }
    if (result.data.length == 0) {
      //无闯关记录，则进行新增操作
      const res = await rushRecords.add({
        data: {
          _openid: event.openid,
          topRecord: event.rushRecord,
          newestRecord: event.rushRecord,
          createTime: new Date(new Date().getTime()),
          updateTime: new Date(new Date().getTime())
        }
      });
      if (res._id) {
        const res = await userInfo.where({
          _openid: event.openid,
        }).update({
          data: {
            userLevel: event.rushRecord.split("-")[0],
            updateTime: new Date(new Date().getTime())
          }
        })
      }
      return res;
    } else {
      //有闯关记录，则进行修改闯关记录
      const res = await rushRecords.doc(rushRecordId).update({
        data: {
          topRecord: event.rushRecord,
          newestRecord: event.rushRecord,
          updateTime: new Date(new Date().getTime())
        }
      })
      return res;
    }

  }

}