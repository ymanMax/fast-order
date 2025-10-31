const app = getApp();

Page({
  data: {
    orderInfo: {},
    isComplete: false,
  },
  onLoad() {
    this.setData({
      orderInfo: app.globalData.orderInfo,
    });
  },
  backHome() {
    wx.reLaunch({
      url: '/pages/home/index',
    });
  },
  submit() {
    app.confirm({ content: '确认支付吗？' }, (res) => {
      if (res.cancel) return;
      const { id } = app.globalData.orderInfo;
      app.request('post', 'applet/order/paySuccess', { id }, (res) => {
        if (res.code != '0000') {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                this.setData({
                  isComplete: true,
                });
                wx.setNavigationBarTitle({
                  title: '提交成功',
                });
              }, 500);
            }
          });
        }
      });
    });
  }
})