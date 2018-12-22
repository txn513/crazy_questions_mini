// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;
const userInfo = db.collection("userInfo");
let condition;
// 云函数入口函数
exports.main = async (event, context) => {
  //按答题总数排行
  if(event.type == 1){
    condition = answerCount;
  } else if (event.type == 2){
    //按答题准确率排行
    condition = accuracyRate;
  }else{
    //按用户等级排行
    condition = userLevel;
    
  }
  return res = await userInfo.orderBy(condition, "desc").get();
}