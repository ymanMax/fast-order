const app = getApp()

Page({
  data: {
    nickName: '',
    avatarUrl: '',
    tempAvatar: '',
    nickNameShow: false,
  },
  onLoad() {
    this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName')
    })
  },
  onShow() {
   
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      tempAvatar: avatarUrl,
    });
  },
  onClose() {
    this.setData({
      nickNameShow: false,
    })
  },
  onSubmit(e) {
    const { nickName } = e.detail.value
    wx.setStorageSync('nickName', nickName)
    wx.setStorageSync('avatarUrl', this.data.tempAvatar)
    this.setData({
      nickName,
      avatarUrl: this.data.tempAvatar,
      nickNameShow: false,
    })
  },
  editnickName() {
    this.setData({
      nickNameShow: true
    })
  },
  pageSkip() {
    app.toast('暂未开放~')
  },
  toOrderList() {
    wx.switchTab({
      url: '/pages/orderInfo/index',
    })
  },
  toOrderItem(e) {
    wx.navigateTo({
      url: '/pages/orderItem/index?type=' + e.currentTarget.dataset.index,
    })
  },
  toMsg() {
    wx.navigateTo({
      url: '/pages/msgInfo/index'
    })
  },
})