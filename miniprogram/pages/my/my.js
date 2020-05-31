import create from '../../utils/create';
import store from '../../store/index';
import config from '../../config/config';

const options = {
  use: [
    'userInfo',
    'hasAuthUserInfo'
  ],
  data: {},
  
  jumpToGuide() {
    wx.navigateTo({
      url: '/pages/guide/guide'
    });
  },

  handleSetting() {
    wx.navigateTo({
      url: '/pages/sheet-setting/sheet-setting'
    });
  },

  showZScode: async function () {
    wx.previewImage({
      urls: [config.tipQrCode],
      current: config.tipQrCode,
    });
  },
};

create.Page(store, options);
