Page({
  data: {
    sheetList: []
  },
  onShow() {
    this.getSheetSetList()
  },
  getSheetSetList() {
    wx.showLoading()
    
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: {
        action: 'query'
      }
    }).then(res => {
      wx.hideLoading()

      const { result = {} } = res || {}
      if (result && result.data) {
        this.setData({
          sheetList: result.data || []
        })
      }
    }).catch(e => {
      console.error('querySheet', e)
      wx.hideLoading()
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
  },
  handleNewSheet(e) {
    wx.navigateTo({
      url: '/pages/sheet-setting/form/form',
    })
  },
  handleEnter(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/sheet-setting/form/form?data=${JSON.stringify(item)}`,
    })
  }
})