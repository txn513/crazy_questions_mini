//app.js
let util = require('./utils/util.js');
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    
    // 调用云函数
    // if (this.userCallback) {
    //   this.userCallback()
    // }
    util.getOpenid(this)
    

    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     //console.log('[云函数] [login] user openid: ', res.result.openid)
    //     this.globalData.openid = res.result.openid
    //     if (this.userCallback) {
    //       this.userCallback(res.result.openid)
    //     }
    //   },
    //   fail: err => {
    //     console.error('[云函数] [login] 调用失败', err)
    //     // wx.navigateTo({
    //     //   url: '../deployFunctions/deployFunctions',
    //     // })
    //   }
    // })
    this.globalData = {

    }
  },

  onGetOpenid: function () {
    
  },
})
