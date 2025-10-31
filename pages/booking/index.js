const app = getApp();

Page({
  data: {
    persionNum: ['1-2人', '3-4人', '5-8人', '8人以上'],
    persionNumIndex: 0,
    showDatetimePop: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}点`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
  },
  onLoad: function (options) {
    this.getBookDict();
  },
  onShow: function () {
    
  },
  getBookDict() {
    app.request('post', 'applet/seatType/getPageList', {
      query: {},
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        this.setData({
          persionNum: res.data.records || []
        });
        return
      }
      app.toast(res.data);
    });
  },
  changePersionNum(e) {
    this.setData({
      persionNumIndex: e.currentTarget.dataset.idx
    })
  },
  async submit() {
    const { name, mobile, sendTime, persionNum, persionNumIndex, remark = '' } = this.data;
    if (!name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
      return
    }
    if (!sendTime) {
      wx.showToast({
        title: '请选择到店时间',
        icon: 'none'
      })
      return
    }
    const extJsonStr = {
      remark,
      reservationName: name,
      reservationPhone: mobile,
      reservationDate: sendTime,
      seatTypeNum: 1,
      seatTypeId: persionNum[persionNumIndex].id,
      depositPrice: persionNum[persionNumIndex].depositPrice,
    }
    app.request('post', 'applet/order/createOrder', extJsonStr, (res) => {
      if (res.code != '0000') {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        app.confirm({
          content: '小王中餐厅温馨提示',
          confirmText: '去点菜',
          cancelText: '仅订座'
        }, (response) => {
          this.setData({
            name: '',
            mobile: '',
            remark: '',
            time: '',
            persionNumIndex: 0
          });
          wx.navigateTo({
            url: response.cancel ? `/pages/orderDetail/index?id=${res.data}` : `/pages/choose/index?id=${res.data}&type=1`,
          });
        });
      }
    });
  },
  showDatetimePop() {
    this.setData({
      showDatetimePop: true
    })
  },
  hideDatetimePop() {
    this.setData({
      showDatetimePop: false
    })
  },
  confirm(e) {
    this.setData({
      sendTime: e.detail,
      time: app.formatTime(e.detail)
    })
    this.hideDatetimePop()
  },
})