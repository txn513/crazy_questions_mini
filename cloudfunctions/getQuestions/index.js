// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const questions = db.collection("questions");
// 云函数入口函数
exports.main = async(event, context) => {
  const currentPage = event.page * event.rows;
  const res = await questions.field({
    _id: true,
    correct_answer: true,
    answer_a: true,
    answer_b: true,
    answer_c: true,
    answer_d: true,
    questions: true
  }).limit(event.rows).skip(currentPage).get();
  return res;
}