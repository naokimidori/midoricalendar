import create from '../../utils/create';
import store from '../../store/index';
import config from '../../config/config';
import { isArrChanged } from '../../utils/utils'

const options = {
  use: [
    'mainBgColor',
    'currentCity',
    'sheetList'
  ],
  data: {
    currentMonth: '',
    currentYear: '',
    currentDay: '',
    weekText: ['日', '一', '二', '三', '四', '五', '六'],
    date: '2020-05',
    day: '',
    year: '',
    month: '',
    today: '',
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    clickedDay: '',
    clickedMonth: '',
    clickedDayItem: {},
    cacheSheetList: [],
    curDayInfos: {},
  },
  onLoad() {
    this.getLocation();
    this.getAllSheetSetting();
    this.init();
  },
  onShow() {
    const { cacheSheetList } = this.data
    const { sheetList } = this.store.data
    // const flag = isArrChanged(cacheSheetList, sheetList)
    this.init();
    this.setData({
      cacheSheetList: sheetList
    })
  },
  getLocation() {
    let _this = this;
    wx.getLocation({
      success: (res) => {
        const { longitude, latitude } = res;
        const location = `${longitude},${latitude}`;
        _this.getCurrentCity(location);
      }
    });
  },
  getCurrentCity(location) {
    let _this = this;
    wx.request({
      url: config.amapGeoUrl,
      method: 'GET',
      data: {
        key: config.amapKey,
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
  handleClickDay(e) {
    const { date = '', item = {} } = e.currentTarget.dataset
    const month = date.substr(0, 6)
    if (date) {
      this.setData({
        showModal: true,
        clickedDay: date,
        clickedMonth: month,
        clickedDayItem: item,
      })
    }
  },
  handleCloseModal() {
    this.resetData()
  },
  handleConfirmModal(e) {
    const { setting } = e.detail || {}
    const { clickedDay, clickedMonth, clickedDayItem } = this.data
    const { year, _month, sheetId } = clickedDayItem || {}
    const { type, sheetId: newSheetId, note } = setting || {}

    console.log('setting', setting);

    // if (clickedDay && newSheetId && newSheetId !== sheetId) {
    if (clickedDay && type === 'ON') {
      wx.cloud.callFunction({
        name: 'calendarSheet',
        data: {
          action: 'addOrUpdate',
          detail: {
            date: clickedDay,
            month: clickedMonth,
            sheetId: newSheetId,
            note: note,
          }
        }
      }).then(async(res) => {
        wx.showLoading(' ')
        let calendar = await this.generateThreeMonths(year, _month)
        let props = {
          calendar,
        }
        // console.log('_month_month', _month, this.data.currentMonth);
        if (_month === this.data.currentMonth) {
          console.log('_month_month2', calendar);
          // const curMonthDays = calendar.second || []
          const curMonthDays = [...calendar.first, ...calendar.second, ...calendar.third, ...calendar.fourth]
          const curDayInfos = curMonthDays.find(x => x.dateId === this.data.today)
          props.curDayInfos = curDayInfos || {};
        }

        this.setData({ ...props })
        wx.hideLoading()
        this.resetData()
      })
    } else if (clickedDay && type === 'OFF') {
      console.log('type === OFF')
      wx.cloud.callFunction({
        name: 'calendarSheet',
        data: {
          action: 'delete',
          detail: {
            date: clickedDay,
          }
        }
      }).then(async(res) => {
        wx.showLoading(' ')
        let calendar = await this.generateThreeMonths(year, _month)
        let props = {
          calendar,
        }
        if (_month === this.data.currentMonth) {
          // const curMonthDays = calendar.second || []
          const curMonthDays = [...calendar.first, ...calendar.second, ...calendar.third, ...calendar.fourth]
          const curDayInfos = curMonthDays.find(x => x.dateId === this.data.today)
          props.curDayInfos = curDayInfos || {};
        }

        this.setData({ ...props })
        wx.hideLoading()
        this.resetData()
      })
    } else {
      this.resetData()
    }
  },
  // handleAddNote() {
  // 	this.setData({
  //     showModal: false,
  //     showNoteModal: true,
  // 	});
  // },
  // handleCloseNoteModal() {
  //   this.setData({
  //     showNoteModal: false,
  //   });
  // },
  // handleConfirmNoteModal(e) {
  //   const { value = '' } = e.detail || {};

  //   const { clickedDay, clickedMonth, clickedDayItem } = this.data
  //   const { year, _month, sheetId } = clickedDayItem || {}
  //   console.log('clickedDayItem', clickedDayItem)
  //   wx.cloud.callFunction({
  //       name: 'calendarSheet',
  //       data: {
  //         action: 'addOrUpdate',
  //         detail: {
  //           date: clickedDay,
  //           month: clickedMonth,
  //           note: value,
  //         }
  //       }
  //     }).then(async(res) => {
  //       wx.showLoading(' ')
  //       let calendar = await this.generateThreeMonths(year, _month)
  //       this.setData({
  //         calendar,
  //         clickedDayItem: {
  //             ...clickedDayItem,
  //             note: value,
  //         }
  //       })
  //       wx.hideLoading()
  //       // this.resetData()
  //       this.setData({
  //         showNoteModal: false,
  //         showModal: true,
  //       });
  //     }).catch((e) => {
  //       wx.showToast({
  //         title: '网络开小差了',
  //       })
  //       this.resetData();
  //     })
  // },
  resetData() {
    this.setData({
      showModal: false,
      clickedDay: '',
      clickedMonth: '',
      clickedDayItem: {},
    })
  },
  /**  
   * 初始化
   */
  async init() {
    const date = new Date(),
      month = this.formatMonth(date.getMonth() + 1),
      year = date.getFullYear(),
      day = this.formatDay(date.getDate()),
      today = `${year}${month}${day}`

    this.setData({
      currentMonth: month,
      currentYear: year,
      currentDay: day,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}/${month}`
    })

    wx.showLoading(' ')
    let calendar = await this.generateThreeMonths(year, month)
    // const curMonthDays = calendar.second || []
    const curMonthDays = [...calendar.first, ...calendar.second, ...calendar.third, ...calendar.fourth]
    const curDayInfos = curMonthDays.find(x => x.dateId === today)
    wx.hideLoading()
    this.setData({
      calendar,
      curDayInfos: curDayInfos || {}
    })

  },
  /**
   * 
   * 左右滑动
   * @param {any} e 
   */
  async swiperChange(e) {
    const { source } = e.detail
    if (source === 'touch') {
      const lastIndex = this.data.swiperIndex,
        currentIndex = e.detail.current
      let flag = false,
        {
          year,
          month,
          day,
          today,
          date,
          calendar,
          swiperMap,
          currentMonth,
          currentDay,
          currentYear,
        } = this.data,
        change = swiperMap[(lastIndex + 2) % 4],
        time = this.countMonth(year, month),
        key = 'lastMonth'

      if (lastIndex > currentIndex) {
        lastIndex === 3 && currentIndex === 0 ?
          flag = true :
          null
      } else {
        lastIndex === 0 && currentIndex === 3 ?
          null :
          flag = true
      }
      if (flag) {
        key = 'nextMonth'
      }

      year = time[key].year
      month = time[key].month
      date = `${year}/${month}`
      day = ''
      if (today.indexOf(date) !== -1) {
        day = today.slice(-2)
      }

      if(parseInt(month) === parseInt(currentMonth) && parseInt(year) === parseInt(currentYear)) {
        day = currentDay;
      }

      time = this.countMonth(year, month)
      calendar[change] = null
      calendar[change] = await this.generateAllDays(time[key].year, time[key].month)

      this.setData({
        swiperIndex: currentIndex,
        //文档上不推荐这么做，但是滑动并不会改变current的值，所以随之而来的计算会出错
        year,
        month,
        date,
        day,
        calendar
      })
    }

  },
  /**
   * 回到当前月
   */
  goBackToday() {
    const { currentMonth, currentYear } = this.data;
    this.changeDate(currentYear, currentMonth);
  },
  /**
   * 点击切换日历
   */
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2),
      year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },
  /**
   * 
   * 直接改变日期
   * @param {any} year 
   * @param {any} month 
   */
  async changeDate(year, month) {
    let {
      day,
      today,
      currentMonth,
      currentDay,
      currentYear,
    } = this.data,
    calendar = await this.generateThreeMonths(year, month),
    date = `${year}-${month}`
    date.indexOf(today) === -1 ?
      day = '01' :
      day = today.slice(-2)
    if(parseInt(month) === parseInt(currentMonth) && parseInt(year) === parseInt(currentYear)) {
      day = currentDay;
    }
    // const curMonthDays = calendar.second || []
    // const curDayInfos = curMonthDays.find(x => x.dateId === this.data.today)
    this.setData({
      calendar,
      // curDayInfos,
      day,
      date,
      month,
      year,
    })
  },
  /**
   * 
   * 生成本月视图以及临近两个月的视图
   * @param {any} year 
   * @param {any} month 
   * @returns {object} calendar
   */
  async generateThreeMonths(year, month) {
    let {
      swiperIndex,
      swiperMap,
      calendar
    } = this.data,
      thisKey = swiperMap[swiperIndex],
      lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1],
      nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1],
      time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = await this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = await this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = await this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    // 注入store
    this.store.data.calendar = calendar;

    return calendar
  },
  /**
   * 
   * 月份处理
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  countMonth(year, month) {
    let lastMonth = {
        month: this.formatMonth(parseInt(month) - 1)
      },
      thisMonth = {
        month,
        year: year + '',
        num: this.getNumOfDays(year, month)
      },
      nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }
    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12 ?
      `${parseInt(year) - 1}` :
      year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1 ?
      `${parseInt(year) + 1}` :
      year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  /**
   * 
   * 获取本月天数
   * @param {number} year 
   * @param {number} month 
   * @param {number} [day=0] 0为本月0最后一天的
   * @returns number 1-31
   */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
  /**
   * 
   * 生成一个月的日历
   * @param {any} year 
   * @param {any} month 
   * @returns Array
   */
  async generateAllDays(year, month) {
    let lastMonth = await this.lastMonthDays(year, month),
      thisMonth = await this.currentMonthDays(year, month),
      nextMonth = await this.nextMonthDays(year, month),
      days = [].concat(lastMonth, thisMonth, nextMonth)

    return days
  },
  async currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    const days = await this.generateDays(year, month, numOfDays)
    
    return days
  },

  /**
   * 
   * 生成日详情
   * @param {any} year 
   * @param {any} month 
   * @param {any} daysNum 
   * @param {boolean} [option={
   * 		startNum:1,
   * 		grey: false
   * 	}] 
   * @returns Array 日期对象数组
   */
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    return new Promise((resolve, reject) => {
      const { notCurrent, startNum } = option;
      if (notCurrent) {
        let days = []
        for (let i = startNum; i <= daysNum; i++) {
          days.push({})
        }
        resolve(days)
      } else {
        let days = []
        const weekMap = ['一', '二', '三', '四', '五', '六', '日']
        for (let i = option.startNum; i <= daysNum; i++) {
          let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
          let day = this.formatDay(i)
          days.push({
            dateId: `${year}${month}${day}`,
            date: `${year}${month}${day}`,
            dateLong:`${year}-${month}-${day}`,
            day,
            week,
            _month: month,
            year: year + ''
          })
        }
        wx.cloud.callFunction({
          name: 'calendarSheet',
          data: {
            action: 'query',
            month: `${year}${month}`,
          }
        }).then(res => {
          if (!this.store.data.hasAuthUserInfo) {
            resolve(days)
            return
          }
          const { sheetList = [] } = this.store.data
          const calendarSheets = res.result.data || []
          const list = calendarSheets.reduce((pre = [], cur) => {
            const target= pre.find(e => e.dateId == cur.date)
            if (target) {
              const dayInfos = sheetList.find(x => x._id === cur.sheetId)
              if (dayInfos) {
                Object.assign(target, dayInfos, cur)
              } else {
                Object.assign(target, cur)
              }
            } else {
              pre.push(cur)
            }
            return pre
          }, days)
          resolve(list)
        }).catch(e => {
          console.error(e)
          resolve(days)
        })
      }
    })
  },

  /**
   * 获取所有的事项设置数据
   */
  getAllSheetSetting() {
    wx.cloud.callFunction({
      name: 'sheetSetList',
      data: {
        action: 'query'
      }
    }).then(res => {
      if (!this.store.data.hasAuthUserInfo) {
        return
      }
      const { result = {} } = res || {}
      if (result && result.data) {
        this.setData({
          cacheSheetList: result.data || []
        })

        this.store.data.sheetList = result.data || []
      }
    }).catch(e => {
      this.store.data.sheetList = []
    })
  },

  /**
   * 生成上个月应显示的天
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  async lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1),
      lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12 ?
      `${parseInt(year) - 1}` :
      year,
      lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1), //本月1号是周几
      days = [];
    if (startWeek == 6) {
      return days
    }
    const startDay = lastNum - startWeek

    return await this.generateDays(lastMonthYear, lastMonth, lastNum, {
      startNum: startDay,
      notCurrent: true
    })
  },
  /**
   * 生成下个月应显示天
   * @param {any} year 
   * @param {any} month
   * @returns 
   */
  async nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1),
      nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1 ?
      `${parseInt(year) + 1}` :
      year,
      nextNum = this.getNumOfDays(nextMonthYear, nextMonth) //下月天数
    let endWeek = this.getWeekOfDate(year, month) //本月最后一天是周几
      ,
      days = [],
      daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return await this.generateDays(nextMonthYear, nextMonth, daysNum, {
      startNum: 1,
      notCurrent: true
    })
  },
  /**
   * 
   * 获取指定月第n天是周几		|
   * 9月第1天： 2017, 08, 1 |
   * 9月第31天：2017, 09, 0 
   * @param {any} year 
   * @param {any} month 
   * @param {number} [day=0] 0为最后一天，1为第一天
   * @returns number 周 1-7, 
   */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';

    return dateOfMonth;
  },

  /**
   * 
   * 月份处理
   * @param {number} month 
   * @returns format month MM 1-12
   */
  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  }
};

create.Page(store, options);
