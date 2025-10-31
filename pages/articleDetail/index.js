const app = getApp();

Page({
  data: {
    title: '',
    dataInfo: {},
  },
  onLoad(options) {
    this.getInfo(options.id);
  },
  // 获取数据
  getInfo(id) {
    app.request('get', `applet/article/${id}`, {}, (res) => {
      if (res.code == '0000') {
        const { title, originalContent } = res.data;
        let result = app.towxml(originalContent,'markdown',{
          base:'https://xiaoxiaofeng.com/restaurant-reservation', // 相对资源的base路径
          theme:'light', // 主题，默认`light`
          events:{  // 为元素绑定的事件方法
            tap:(e)=>{
              console.log('tap',e);
            }
          }
        });
        this.setData({
          title,
          dataInfo: result,
        });
        return;
      }
      app.toast(res.data);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onShareTimeline() {
    
  }
});
