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
    case 'update': {
      return updateSheetSet(event)
    }
    case 'delete': {
      return deleteSheetSet(event)
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

async function updateSheetSet(event) {
  const { _id, sheetName, startTime, endTime, color, action } = event || {}
  return await db.collection('sheet_set_list')
    .doc(_id)
    .update({
      data: {
        sheetName,
        startTime,
        endTime,
        color,
        action,
      }
    })
}

async function deleteSheetSet(event) {
  const { _id } = event || {}
  return await db.collection('sheet_set_list').doc(_id).remove();
}
