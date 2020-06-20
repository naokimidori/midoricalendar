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

  },
})