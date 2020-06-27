import create from '../../utils/create';
import store from '../../store/index';
import { isArrChanged } from '../../utils/utils'

const options = {
  use: ['hasAuthUserInfo'],
  data: {
    sheetList: [],
  },
  onShow() {
    if (this.store.data.hasAuthUserInfo) {
      this.getSheetSetList()
    }
  },
  getSheetSetList() {
    wx.showLoading()
    const oldSheetList = this.store.data.sheetList
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: {
        action: 'query'
      }
    }).then(res => {
      wx.hideLoading()

      const { result = {} } = res || {}
      if (result && result.data) {
        const newSheetList = result.data || []
        this.setData({
          sheetList: newSheetList
        })
        const flag = isArrChanged(oldSheetList, newSheetList)
        if (flag) {
          this.store.data.sheetList = result.data || []
        }
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
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/guide/guide'
    });
  },
}

create.Page(store, options);
