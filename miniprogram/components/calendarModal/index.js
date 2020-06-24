import create from '../../utils/create';

create.Component({
  use: ['sheetList'],
  properties: {
    showModal: {
      type: Boolean,
      value: false,
    },
    date: {
      type: String,
      value: '',
    },
  },
  data: {
    curId: '',
    curName: '空',
    curColor: '',
  },
  methods: {
    hideModal() {
      this.triggerEvent("cancelEvent")
    },
    confirmModal() {
      const { curItem } = this.data
      let modalData = {
        setting: curItem,
      } 
      this.triggerEvent("confirmEvent", modalData)
    },
    onSelectItem(e) {
      const { item } = e.currentTarget.dataset
      const { _id, color, sheetName, startTime, endTime } = item || {}

      let _text = sheetName
      if (startTime && endTime) {
        _text = `${_text} ${startTime} ~ ${endTime}` 
      }

      this.setData({
        curId: _id || '',
        curName: _text || '',
        curColor: color || '',
        curItem: item || {}
      })
    },
    clearSelct() {
      this.setData({
        curId: '',
        curName: '空',
        curColor: '',
      })
    }
  }
})
