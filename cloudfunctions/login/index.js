const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init();
const db = cloud.database();
const userInfo = db.collection("userInfo");
exports.main = async(event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = await cloud.getWXContext();
  const openid = wxContext.OPENID;
  const appid = wxContext.APPID;
  const unionid = wxContext.UNIONID;
  try {
    const res = await userInfo.where({
      _openid: openid // 填入当前用户 openid
    }).get();
    if (res.data.length != 0) {
      const resultObj = {};
      resultObj.code = 201;
      resultObj.msg = "该用户已存在！";
      resultObj.data = {
        openid: openid,
        appid: appid,
        unionid: unionid
      };
      return resultObj;
    } else {
      const result = await userInfo.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          _openid: openid,
          appid: appid,
          unionid: unionid,
          createTime: new Date(new Date().getTime()),
          updateTime: new Date(new Date().getTime())
        }
      })
      const resultObj = {};
      resultObj.code = 200;
      resultObj.msg = "添加用户信息成功！";
      resultObj.data = {
        openid: openid,
        appid: appid,
        unionid: unionid
      };
      return resultObj;
    }
  } catch (e) {
    const resultObj = {};
    resultObj.code = 203;
    resultObj.msg = "添加用户信息失败！";
    return resultObj;
  }
}