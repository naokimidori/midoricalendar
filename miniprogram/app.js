import { ENV } from './config/index';
import store from './store/index';

//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: ENV,
        traceUser: true,
      })
    }
    this.getAuthInfo();
  },
  getAuthInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          store.data.hasAuthUserInfo = true;
          wx.getUserInfo({
            success: res => {
              const { userInfo } = res || {};
              store.data.userInfo = userInfo;
            }
          })
        } else {
          // 未授权
          store.data.hasAuthUserInfo = false;
          store.data.userInfo = {};
        }
      }
    })
  },
})
