import create from '../../utils/create';
import store from '../../store/index';

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
      urls: ['cloud://calendar-prod-w7kpb.6361-calendar-prod-w7kpb-1302089220/project_pics/zanshang.jpg'],
      current: 'cloud://calendar-prod-w7kpb.6361-calendar-prod-w7kpb-1302089220/project_pics/zanshang.jpg',
    });
  },
};

create.Page(store, options);
