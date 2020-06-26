import create from '../../utils/create';

create.Component({
  use: ['sheetList'],
  properties: {
    showModal: {
      type: Boolean,
      value: false,
    },
    modalData: {
      type: Object,
      value: {},
      observer: function(newVal) {
        const { sheetId = '', sheetName = ''} = newVal || {}
        if (sheetId) {
          this.setData({
            curName: sheetName,
            curSheetId: sheetId
          })
        } else {
          this.setData({
            curName: '空',
            curSheetId: '',
            type: 'OFF',
            curItem: {},
          })
        }
      }
    },
  },
  data: {
    type: 'OFF',
    curSheetId: '',
    curName: '空',
    curItem: {},
  },
  methods: {
    hideModal() {
      this.triggerEvent("cancelEvent")
    },
    confirmModal() {
      const { type, curSheetId } = this.data
      let setData = {
        setting: {
          sheetId: curSheetId,
          type,
        }
      }
      this.triggerEvent("confirmEvent", setData)
    },
    onSelectItem(e) {
      const { item } = e.currentTarget.dataset
      const { _id, sheetName, startTime, endTime } = item || {}

      let _text = sheetName
      if (startTime && endTime) {
        _text = `${_text} ${startTime} ~ ${endTime}` 
      }
      this.setData({
        type:'ON',
        curSheetId: _id || '',
        curName: _text || '',
        curItem: item || {}
      })
    },
    clearSelct() {
      this.setData({
        type:'OFF',
        curSheetId: '',
        curName: '空',
        curItem: {},
      })
    }
  }
})
