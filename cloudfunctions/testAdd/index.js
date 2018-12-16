// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const testadd = db.collection('test')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await testadd.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        a:event.a,
        b:event.b,
        sum: event.a + event.b
      }
    })
  } catch (e) {
    console.error(e)
  }
}