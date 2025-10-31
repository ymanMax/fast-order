const app = getApp()

Page({
  data: {
    kindList: [],
    orderList: [],
    activeIndex: 0,
  },
  onLoad: function (options) {
    this.categories();
  },
  onShow: function () {
    this.categories();
  },
  // 取消订单
  cancelOrder(e) {
    const { arg } = e.currentTarget.dataset;
    app.confirm({ content: '确认取消该笔订单？' }, (res) => {
      if (res.cancel) return;
      app.request('post', 'applet/order/cancelOrder', {
        id: arg.id
      }, (res) => {
        if (res.code == '0000') {
          this.getOrderList();
          return;
        }
        app.toast(res.data);
      });
    });
  },
  // 获取分类
  categories() {
    app.request('get', 'applet/user/getDictByCode/reservation_status', {
      query: {},
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        this.setData({
          kindList: res.data || [],
        });
        wx.setStorageSync('orderStatusDict', res.data);
        this.getOrderList();
        return;
      }
      app.toast(res.data);
    });
  },
  onChange(e) {
    this.setData({
      activeIndex: e.detail.index,
    });
    this.getOrderList();
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/index?id=' + e.currentTarget.dataset.arg.id,
    });
  },
  getOrderList() {
    const { kindList, activeIndex } = this.data;
    app.request('post', 'applet/order/getPageList', {
      query: {
        reservationStatus: kindList[activeIndex].dictValue,
      },
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.records || [];
        tempArr.forEach((item) => {
          item.reservationDate && (item.orderTm = app.formatTime(item.reservationDate));
        });
        this.setData({
          orderList: tempArr,
        });
        return;
      }
      app.toast(res.data);
    });
  },
})