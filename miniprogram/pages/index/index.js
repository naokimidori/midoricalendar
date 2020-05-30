import create from '../../utils/create';
import store from '../../store/index';

const options = {
  use: ['mainBgColor'],
  data: {
  },
  onLoad() {
    this.getLocation();
  },
  getLocation() {
    let _this = this;
    wx.getLocation({
      success: (res) => {
        console.log(res);
        const { longitude, latitude } = res;
        const location = `${longitude},${latitude}`;
        _this.getCurrentCity(location);
      }
    });
  },
  getCurrentCity(location) {
    let _this = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      method: 'GET',
      data: {
        key: 'aadcb3316c0472d20f026b75e326c34a',
        location,
      },
      success(res) {
        if (res && res.statusCode === 200) {
          const { regeocode = {} } = res.data;
          const { addressComponent = {} } = regeocode;
          const { city, province } = addressComponent;

          const currentCity = city || province || '';
          _this.store.data.currentCity = currentCity;
        }
      }
    })
  },
};

create.Page(store, options);
