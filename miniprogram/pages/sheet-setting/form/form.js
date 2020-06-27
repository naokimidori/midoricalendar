import { colorList } from '../../../config/colorList';

Page({
  data: {
    colorList: colorList,
    activeColor: '',
    name: '',
    startTime: '',
    endTime: '',
    isEdit: false,
    _id: '',
  },

  onLoad(option) {
    const { data } = option
    if (data) {
      const parseData = JSON.parse(data)
      const { color, sheetName, startTime, endTime, _id } = parseData || {}
      this.setData({
        name: sheetName,
        activeColor: color,
        startTime,
        endTime,
        isEdit: true,
        _id,
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
    const { name, activeColor, startTime, endTime, isEdit, _id } = this.data

    if (!name) {
      wx.showToast({
        title: '请输入事项名称',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (name.length > 3) {
      wx.showToast({
        title: '事项名称最多支持3个字符',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading()
    if (isEdit && _id) { // 修改
      const params = {
        sheetName: name,
        startTime,
        endTime,
        color: activeColor,
        _id,
        action: 'update',
      }
      this.setSheetSetList(params)
    } else { // 新建
      const params = {
        sheetName: name,
        startTime,
        endTime,
        color: activeColor,
        action: 'add',
      }
      this.setSheetSetList(params)
    }
  },
  setSheetSetList(params) {
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: params,
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
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
  },
  handleDelete() {
    const { _id, isEdit } = this.data

    if (!isEdit) return
    
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: {
        _id,
        action: 'delete',
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
  },
})
