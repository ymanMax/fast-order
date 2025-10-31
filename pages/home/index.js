const app = getApp()

Page({
  data: {
    advList: [],
    kindList: [],
    articleList: [],
    activeIndex: 0,
  },
  onLoad: function (e) {
    this.getBanner();
  },
  onShow: function(){
    this.categories();
    // this.selectComponent('#tabs').resize();
  },
  goDetail(e) {
    wx.navigateTo({
      url: `/pages/articleDetail/index?id=${e.currentTarget.dataset.arg.id}`,
    });
  },
  // 获取广告轮播
  getBanner() {
    app.request('get', 'applet/user/getDictByCode/home_slideshow', {
      query: {},
      page: {
        size: 20,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        this.setData({
          advList: res.data || [],
        });
        return;
      }
      app.toast(res.data);
    });
  },
  // 获取分类
  categories() {
    app.request('get', 'applet/user/getDictByCode/article_type', {
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
        this.getArticle();
        return;
      }
      app.toast(res.data);
    });
  },
  getArticle() {
    const { kindList, activeIndex } = this.data;
    app.request('post', 'applet/article/getPageList', {
      query: {
        articleType: kindList[activeIndex].dictValue,
      },
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        this.setData({
          articleList: res.data.records || []
        });
        return
      }
      this.setData({
        articleList: []
      });
      app.toast(res.data);
    });
  },
  onChange(e) {
    this.setData({
      activeIndex: e.detail.index,
    });
    this.getArticle();
  },
})
