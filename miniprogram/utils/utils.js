export function isArrChanged(oldArr = [], newArr = []) {
  const oldStr = JSON.stringify(oldArr) || ''
  const newStr = JSON.stringify(newArr) || ''

  if (oldStr === newStr) {
    return false
  }

  return true
}
