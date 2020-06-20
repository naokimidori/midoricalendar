import { colorList, multiArray } from '../../../config/colorList';

Page({
  data: {
    colorList: colorList,
    multiArray: multiArray,
    activeColor: '#e54d42',
    name: '',
    start: {
      type: '',
      time: '',
    },
    end: {
      type: '',
      time: ''
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
      'start.type': value[0] === 0 ? 'today' : 'tomorrow',
      'start.time': `${multiArray[1][value[1]]}:${multiArray[3][value[3]]}`,
    })
  },

  bindEndPickerChange(e) {
    const { value = [] } = e.detail
    this.setData({
      'end.type': value[0] === 0 ? 'today' : 'tomorrow',
      'end.time': `${multiArray[1][value[1]]}:${multiArray[3][value[3]]}`,
    })
  },

  handleSave() {
    const { name, activeColor, start, end } = this.data
    const { type: startType, time: startTime } = start
    const { type: endType, time: endTime } = end

    if (!name || !activeColor || !startTime || !endTime) {
      wx.showToast({
        title: '请检查输入项是否非空',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (name.length>4) {
      wx.showToast({
        title: '班次名称最多支持4个字符',
        icon: 'none',
        duration: 2000
      })
      return
    }

    const params = {
      sheetName: name,
      startType: 'today',
      startTime,
      endType,
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
        wx.navigateTo({
          url: '/pages/sheet-setting/sheet-setting',
        })
      }, 2000)
    }).catch(e => {
      wx.hideLoading()
      console.error('addSheetSettingInfo', e)
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
  },
})