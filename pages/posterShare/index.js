// pages/posterShare/index.js
Page({
  data: {
    canvasWidth: 375,
    canvasHeight: 667,
    posterImage: '',
    qrCodeImage: '',
    loading: true
  },

  onLoad: function (options) {
    // 初始化画布
    this.initCanvas()
  },

  // 初始化画布
  initCanvas: function () {
    const that = this
    const query = wx.createSelectorQuery().in(this)
    query.select('.poster-canvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        if (!res || res.length === 0 || !res[0]) {
          wx.showToast({
            title: '无法找到画布元素',
            icon: 'none'
          })
          return
        }

        const canvas = res[0].node
        if (!canvas) {
          wx.showToast({
            title: '无法获取画布节点',
            icon: 'none'
          })
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          wx.showToast({
            title: '无法获取画布上下文',
            icon: 'none'
          })
          return
        }

        // 设置画布大小
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        // 绘制背景图片
        that.drawBackgroundImage(canvas, ctx)
      })
  },

  // 绘制背景图片
  drawBackgroundImage: function (canvas, ctx) {
    const that = this
    const image = canvas.createImage()
    image.src = '/images/sale.png'
    image.onload = function () {
      // 计算图片缩放比例，保持原图比例并填满画布
      const imgRatio = image.width / image.height
      const canvasRatio = that.data.canvasWidth / that.data.canvasHeight
      let drawWidth, drawHeight, offsetX, offsetY

      if (imgRatio > canvasRatio) {
        drawWidth = that.data.canvasWidth
        drawHeight = that.data.canvasWidth / imgRatio
        offsetX = 0
        offsetY = (that.data.canvasHeight - drawHeight) / 2
      } else {
        drawWidth = that.data.canvasHeight * imgRatio
        drawHeight = that.data.canvasHeight
        offsetX = (that.data.canvasWidth - drawWidth) / 2
        offsetY = 0
      }

      // 绘制背景图片
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

      // 绘制二维码
      that.drawQRCode(canvas, ctx)
    }
    image.onerror = function () {
      console.error('背景图片加载失败')
      wx.showToast({
        title: '背景图片加载失败',
        icon: 'none'
      })
      that.setData({
        loading: false
      })
    }
  },

  // 绘制二维码
  drawQRCode: function (canvas, ctx) {
    const that = this
    const qrCodeSize = 120
    const qrCodeX = (this.data.canvasWidth - qrCodeSize) / 2
    const qrCodeY = this.data.canvasHeight - qrCodeSize - 20

    // 生成二维码
    wx.request({
      url: 'https://api.qrserver.com/v1/create-qr-code/',
      data: {
        size: '120x120',
        data: 'https://ludanzuixiafan.com'
      },
      responseType: 'arraybuffer',
      success: (res) => {
        const qrCodeImage = canvas.createImage()
        qrCodeImage.src = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data)
        qrCodeImage.onload = function () {
          // 绘制二维码背景
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(qrCodeX - 10, qrCodeY - 10, qrCodeSize + 20, qrCodeSize + 20)

          // 绘制二维码
          ctx.drawImage(qrCodeImage, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize)

          // 保存海报图片
          that.savePosterImage(canvas)
        }
        qrCodeImage.onerror = function () {
          console.error('二维码图片加载失败')
          wx.showToast({
            title: '二维码图片加载失败',
            icon: 'none'
          })
          that.setData({
            loading: false
          })
        }
      },
      fail: (err) => {
        console.error('生成二维码失败:', err)
        wx.showToast({
          title: '生成二维码失败',
          icon: 'none'
        })
        that.setData({
          loading: false
        })
      }
    })
  },

  // 保存海报图片
  savePosterImage: function (canvas) {
    const that = this
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        that.setData({
          posterImage: res.tempFilePath,
          loading: false
        })
      },
      fail: (err) => {
        console.error('保存海报图片失败:', err)
        wx.showToast({
          title: '保存海报图片失败',
          icon: 'none'
        })
        that.setData({
          loading: false
        })
      }
    })
  },

  // 保存海报到相册
  savePoster: function () {
    if (!this.data.posterImage) {
      wx.showToast({
        title: '海报正在生成中...',
        icon: 'none'
      })
      return
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImage,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('保存海报失败:', err)
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
        // 如果用户拒绝授权，引导用户打开设置
        if (err.errMsg.includes('auth deny')) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.writePhotosAlbum']) {
                this.savePoster()
              }
            }
          })
        }
      }
    })
  },

  // 分享海报给朋友
  onShareAppMessage: function () {
    if (!this.data.posterImage) {
      wx.showToast({
        title: '海报正在生成中...',
        icon: 'none'
      })
      return
    }

    return {
      title: '分享海报',
      path: '/pages/posterShare/index',
      imageUrl: this.data.posterImage
    }
  }
})