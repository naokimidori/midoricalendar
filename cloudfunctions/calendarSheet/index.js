// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    // case 'add': {
    //   return addSheetSetList(event)
    // }
    case 'query': {
      return queryCanlendarSheet(event)
    }
    // case 'update': {
    //   return updateSheetSet(event)
    // }
    // case 'delete': {
    //   return deleteSheetSet(event)
    // }
    default: {
      return
    }
  }
}

async function queryCanlendarSheet(event) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  return await db.collection('calendar_sheet')
    .where({
      'userInfo.openId': openId,
      'month': event.month
    })
    .get()
}
