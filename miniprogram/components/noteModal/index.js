Component({
  properties: {
    showModal: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    value: '',
  },
  methods: {
    hideModal() {
      this.triggerEvent("cancelEvent")
    },
    confirmModal() {
      const props = {
        value: this.data.value,
      }
      this.triggerEvent("confirmEvent", props);
    },
    textareaAInput(e) {
      const { value = '' } = e.detail || {};
      this.setData({ value });
    }
  }
})