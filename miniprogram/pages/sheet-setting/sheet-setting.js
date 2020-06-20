// miniprogram/pages/sheet-setting/sheet-setting.js
Page({
  data: {

  },
  handleToForm(e) {
    const { type } = e.currentTarget.dataset
    if (type) {
      wx.navigateTo({
        url: '/pages/sheet-setting/form/form',
      })
    }
  }
})