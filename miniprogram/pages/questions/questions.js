// miniprogram/pages/questions/questions.js
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
    // currectSelections: [], //当前选项
  },

  getQuestions(){
    let that = this;
    let { currentIndex} = this.data;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getQuestions',
      // 传给云函数的参数
    }).then(res => {
        console.log(res.result) // 3
        that.setData({
          questionList: res.result.data,
          currentQuestion: res.result.data[currentIndex]
        })
      })
      .catch(console.error)
  },

  awsClick(e){
    let { aws } = e.currentTarget.dataset; 
    console.log(aws)
    this.checkAnswer(aws)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.getQuestions()
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight
        })
      },
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