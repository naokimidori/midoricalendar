import { colorList } from '../../../config/colorList';

Page({
  data: {
    colorList: colorList,
    activeColor: '#e54d42',
    name: '',
    startTime: '',
    endTime: '',
  },

  onLoad(option) {
    const { data } = option
    if (data) {
      const parseData = JSON.parse(data)
      const { color, sheetName, startTime, endTime } = parseData || {}
      this.setData({
        name: sheetName,
        activeColor: color,
        startTime,
        endTime,
      })
    }
  },

  onNameInput(e) {
    const { value = '' } = e.detail
    this.setData({
      name: value,
    })
  },

  onSelectColor(e) {
    const { color } = e.target.dataset;
    if (color) {
      this.setData({
        activeColor: color
      })
    }
  },

  bindStartPickerChange(e) {
    const { value = [] } = e.detail
    this.setData({
      startTime: value
    })
  },

  bindEndPickerChange(e) {
    const { value = [] } = e.detail
    this.setData({
      endTime: value
    })

  },

  handleSave() {
    const { name, activeColor, startTime, endTime } = this.data

    if (!name) {
      wx.showToast({
        title: '请输入班次名称',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (name.length > 4) {
      wx.showToast({
        title: '班次名称最多支持4个字符',
        icon: 'none',
        duration: 2000
      })
      return
    }

    const params = {
      sheetName: name,
      startTime,
      endTime,
      color: activeColor,
    }

    wx.showLoading({
      title: '保存中',
    })
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: {
        ...params, 
        action: 'add'

      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }).catch(e => {
      wx.hideLoading()
      console.error('addsheetSetList', e)
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
  },
})