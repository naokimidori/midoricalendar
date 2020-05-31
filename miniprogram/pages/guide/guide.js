import create from '../../utils/create';
import store from '../../store/index';
import config from '../../config/config';

const options = {
  use: [],
  data: {
    picUrl: config.logoGif
  },
  handleGetUserInfo() {
    let _this = this;
    wx.showLoading()
    wx.getUserInfo({
      success: function(res) {
        const { userInfo } = res || {};
        _this.store.data.userInfo = userInfo || {};
        _this.store.data.hasAuthUserInfo = true;
        wx.navigateBack()
      },
      complete: () => {
        wx.hideLoading()
      },
    })
  },
  handleBack() {
    wx.navigateBack()
  },
};

create.Page(store, options);
