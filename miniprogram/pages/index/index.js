//index.js
const app = getApp()
let util = require('../../utils/util.js');

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfoAuth: false
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    //获取闯关数
    util.ifGotOpenid(app, () => {
      this.getRushRecords(app.globalData.openid)
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                userInfoAuth: true
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.cloud.callFunction({
        //   name: 'addUser',
        //   data: {
        //     openid: res.result.openid,
        //     appid: res.result.appid,
        //     unionid: res.result.unionid
        //   },
        //   success: res => {
        //     console.log(res);
        //     wx.navigateTo({
        //       url: '../userConsole/userConsole',
        //     })
        //   }
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //获取用户答题信息，例如闯关数
  getRushRecords(openid){
    wx.cloud.callFunction({
      name: 'getRushRecords',
      data: {
        openid
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        
      }
    })
  },

  //获取
  bindGetUserInfo(e) {
    if (!e.detail.userInfo) {
      console.log('用户拒绝')
      return;
    }
    console.log(e.detail.userInfo)
    let { userInfoAuth } = this.data;
    if (userInfoAuth) {
      wx.navigateTo({
        url: '/pages/questions/questions',
      })
    } else {
      let { avatarUrl, city, country, gender, nickName, province } = e.detail.userInfo
      util.ifGotOpenid(app, () => {
        wx.cloud.callFunction({
          name: 'updateUser',
          data: {
            openid: app.globalData.openid,
            avatarUrl,
            city,
            country,
            gender,
            nickName,
            province
          },
          success: res => {
            console.log(res + '-------------------');
            wx.navigateTo({
                url: '/pages/questions/questions',
            })
          }
        })
      })
      
    }
    
  }

})
