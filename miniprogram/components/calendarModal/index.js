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
        // console.log('newVal', newVal);
        const { sheetId = '', sheetName = '', note = '' } = newVal || {}
        if (sheetId || note) {
          this.setData({
            curName: sheetName,
            curSheetId: sheetId,
            curNote: note,
            type: 'ON',
          })
        } else {
          this.setData({
            curName: '空',
            curSheetId: '',
            type: 'OFF',
            curItem: {},
            curNote: '',
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
    showNoteArea: false,
    curNote: '',
  },
  methods: {
    hideModal() {
      this.triggerEvent("cancelEvent")
    },
    confirmModal() {
      const { curSheetId, curNote } = this.data;
      let { type } = this.data;
      if (curNote) {
        type = 'ON'
      }
      let setData = {
        setting: {
          sheetId: curSheetId,
          type,
          note: curNote,
        }
      }
      this.triggerEvent("confirmEvent", setData)
    },
    handleAddNote() {
      this.setData({
        showNoteArea: true,
      });
    },
    onComplete() {
      this.setData({
        showNoteArea: false,
      });
    },
    textareaAInput(e) {
      const { value = '' } = e.detail || {};
      this.setData({  curNote: value });
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
    },
    goSheetSetting() {
      wx.navigateTo({
        url: '/pages/sheet-setting/sheet-setting',
      })
      this.hideModal()
    },
  }
})
