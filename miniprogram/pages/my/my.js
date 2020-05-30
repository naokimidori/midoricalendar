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
};

create.Page(store, options);
