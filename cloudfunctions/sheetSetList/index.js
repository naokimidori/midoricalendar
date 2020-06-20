// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'add': {
      return addSheetSetList(event)
    }
    case 'query': {
      return querySheetSetList(event)
    }
    default: {
      return
    }
  }
}

async function addSheetSetList(event) {
  const wxContext = cloud.getWXContext()

  return await db.collection('sheet_set_list').add({
    data: {
      ...event,
    }
  })
}

async function querySheetSetList(event) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  return await db.collection('sheet_set_list')
    .where({
      'userInfo.openId': openId
    })
    .get()
}
