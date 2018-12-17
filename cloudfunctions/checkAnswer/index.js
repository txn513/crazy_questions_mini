// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const checkAnswer = db.collection("questions");
const resultObj = {};
// 云函数入口函数
exports.main = async(event, context) => {
  const res = await checkAnswer.doc(event.questionId).get();
  if (res.data.correct_answer == event.answer) {
    resultObj.code = 200;
    resultObj.data = {
        isTrue: true,
        questionId: res.data._id
      },
      resultObj.msg = "恭喜您，挑战成功！";
  } else {
    resultObj.code = 201;
    resultObj.data = {
        isTrue: false,
        questionId: res.data._id
      },
      resultObj.msg = "挑战失败！";
  }
  return resultObj;
}