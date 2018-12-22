// miniprogram/pages/questions/questions.js
let util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: null, //屏幕高度
    
    //临时
    currentIndex: 0, //当前题目下标
    questionList: null, //问题list
    currentQuestion: null, //当前问题
    currectSelections: [], //当前选项
    selectionColorShow: false,
    clickSelec: '',
    page: 0,
    disableClick: false,
    accuracyRate: 0,
    correntSum:0,
    errorSum:0
  },

  //获取题目
  getQuestions(res){
    let that = this;
    console.log(res)
    let { currentIndex} = this.data;
    let { accuracyRate,correntSum,errorSum} = res.userInfo;
    let recordRes = []
    if (res.rushRecords) {
      recordRes = res.rushRecords.newestRecord.split('-');
    } else {
      recordRes = [0, -1];
    }
    
    
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getQuestions',
      data: {
        page: recordRes[0],
        rows: 90,
      },
      // 传给云函数的参数
    }).then(res => {
        console.log(res.result) // 3
        
      
        that.setData({
          currentIndex: parseInt(recordRes[1])+1,
          questionList: res.result.data,
          accuracyRate,
          correntSum,
          errorSum
        })
      this.getSelections(this.data.currentIndex)
      })
      .catch(console.error)
  },

  getSelections(currentIndex){
    let { questionList} = this.data;
    let currentQuestion = questionList[currentIndex]
    let _arr = [];
    for (let key in currentQuestion) {
      if (key.indexOf('answer_')> -1) {
        let _obj = {}
        if (key.indexOf('_a') > -1) {
          _obj['tag'] = "A"
        } else if (key.indexOf('_b') > -1) {
          _obj['tag'] = "B"
        } else if (key.indexOf('_c') > -1) {
          _obj['tag'] = "C"
        } else if (key.indexOf('_d') > -1) {
          _obj['tag'] = "D"
        }
        
        _obj['value'] = currentQuestion[key]
        _arr.push(_obj)
      }
      
    }

    console.log(_arr)
    this.setData({
      currectSelections: _arr,
      currentQuestion
    })
  },

  awsClick(e){
    
    let { aws } = e.currentTarget.dataset; 
    let { currentQuestion, disableClick} = this.data;
     this.setData({
       disableClick: true
     })
    if (disableClick) {
      return
    }
    console.log(aws)
    // this.checkAnswer(aws)

    //本地判断
    util.ifGotOpenid(app, () => {
      //更新数据
      this.addRecords(aws == currentQuestion.correct_answer);

      this.setData({
        selectionColorShow: true,
        clickSelec: aws
      })

      setTimeout(() => {
        
        this.setData({
          selectionColorShow: false,
          currentIndex: this.data.currentIndex + 1,
          clickSelec: '',
          disableClick: false
        })
        console.log(this.data.currentIndex)
        this.getSelections(this.data.currentIndex)
      }, 2000)
    })
    // if (app.globalData.openid) {
    //   this.addRecords(aws == currentQuestion.correct_answer)
    // } else {
    //   app.userCallback = openid => {
    //     if (openid) {
    //       this.addRecords(aws == currentQuestion.correct_answer)
    //     }
    //   }
    // }
    
    
  },

  checkAnswer(aws){
    let { currentQuestion } = this.data;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'checkAnswer',
      data: {
        questionId: currentQuestion._id,
        answer: aws
      }
      // 传给云函数的参数
    }).then(res => {
      console.log(res.result) // 3

    }).catch(console.error)
  },

  addRecords(isTrue){
    let { currentQuestion, accuracyRate, correntSum, errorSum } = this.data;
    
    console.log({
      openid: app.globalData.openid,
      questionId: currentQuestion._id,
      isTrue,
      rushRecord: this.data.page + '-' + this.data.currentIndex
    })
    if (isTrue) {
      correntSum++
    } else {
      errorSum++
    }
    accuracyRate = correntSum / (correntSum + errorSum)
    this.setData({
      accuracyRate,
      correntSum,
      errorSum
    })
    wx.cloud.callFunction({
      name: 'addRecords',
      data: {
        openid: app.globalData.openid,
        questionId: currentQuestion._id,
        isTrue,
        rushRecord: this.data.page +'-' + this.data.currentIndex,
        accuracyRate,
        correntSum,
        errorSum
      }
    }).then(res => {
      console.log(res.result) // 3

    }).catch(console.error)
  },

  //获取用户答题信息，例如闯关数
  getRushRecords(openid) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getRushRecords',
        data: {
          openid
        },
        success: res => {
          console.log(res.result)
          // if (res.result.data.rushRecords) {    
          //   // resolve(res.result.data.rushRecords.newestRecord.split('-'))
          //   resolve(res.result.data)
          // } else {
          //   resolve([0,-1])
          // }
          resolve(res.result.data)
        },
        fail: err => {
          reject(err)
        }
      })
    })
    
    // try {
    //   let res = await f
    //   console.log(res)
    // } catch (err){
    //   console.log(err)
    // }
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })

    //获取闯关数
    util.ifGotOpenid(app, () => {
      this.getRushRecords(app.globalData.openid).then(res => {
        this.getQuestions(res)
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})