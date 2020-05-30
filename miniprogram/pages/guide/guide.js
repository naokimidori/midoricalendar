import create from '../../utils/create';
import store from '../../store/index';

const options = {
  use: [],
  data: {
    picUrl: 'https://cdn.nlark.com/yuque/0/2019/gif/280373/1567733825085-assets/web-upload/8f327547-55d1-4397-aeba-8ae68309d0fb.gif'
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
