// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'addOrUpdate': {
      return addOrUpdateCalendarSheet(event)
    }
    case 'query': {
      return queryCalendarSheet(event)
    }
    case 'delete': {
      return deleteCalendarSheet(event)
    }
    default: {
      return
    }
  }
}

async function queryCalendarSheet(event) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  return await db.collection('calendar_sheet')
    .where({
      'userInfo.openId': openId,
      'month': event.month
    })
    .get()
}

async function addOrUpdateCalendarSheet(event) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const { detail } = event || {}

  const result = await db.collection('calendar_sheet')
    .where({
      'userInfo.openId': openId,
      'date': detail.date
    }).get()

  if (result.data.length === 0) {
    return await db.collection('calendar_sheet')
      .add({
        data: {
          ...detail,
          userInfo: {
            appId: wxContext.APPID,
            openId: wxContext.OPENID
          }
        }
      })
  } else if (result.data.length > 0) {
    return await db.collection('calendar_sheet')
      .where({
        'userInfo.openId': openId,
        'date': detail.date
      })
      .update({
        data: {
          sheetId: detail.sheetId || ''
        }
      })
  }
}

async function deleteCalendarSheet(event) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const { detail } = event || {}

  return await db.collection('calendar_sheet')
    .where({
      'userInfo.openId': openId,
      'date': detail.date
    })
    .remove()
}
