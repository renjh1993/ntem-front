import request from '@/utils/request'

// 查询报文格式转换明细列表
export function listMsg(query) {
  return request({
    url: '/configuration/msg/list',
    method: 'get',
    params: query
  })
}

// 查询报文格式转换明细详细
export function getMsg(fmtMsgPk) {
  return request({
    url: '/configuration/msg/' + fmtMsgPk,
    method: 'get'
  })
}

// 新增报文格式转换明细
export function addMsg(data) {
  return request({
    url: '/configuration/msg',
    method: 'post',
    data: data
  })
}

// 修改报文格式转换明细
export function updateMsg(data) {
  return request({
    url: '/configuration/msg',
    method: 'put',
    data: data
  })
}

// 删除报文格式转换明细
export function delMsg(fmtMsgPk) {
  return request({
    url: '/configuration/msg/' + fmtMsgPk,
    method: 'delete'
  })
}

// 批量删除报文格式转换明细
export function delMsgs(fmtMsgPks) {
  console.log('fmtMsgPks:', fmtMsgPks)
  const data = {
    fmtMsgPks
  }
  return request({
    url: '/configuration/msg/delMsgs',
    method: 'post',
    data: data
  })
}

// 导出报文格式转换明细
export function exportMsg(query) {
  return request({
    url: '/configuration/msg/export',
    method: 'get',
    params: query
  })
}

// 批量修改pid
export function batchUpdatePid(parentId, ids) {
  const data = {
    parentId,
    ids
  }
  return request({
    url: '/configuration/msg/batchUpdatePid',
    method: 'post',
    data: data
  })
}

// 粘贴进的数据
export function newPasteData(currentPid, currentTransfRgPk, pasteArr, selectProps) {
  const data = {
    currentPid,
    currentTransfRgPk,
    pasteArr,
    selectProps
  }
  return request({
    url: '/configuration/msg/newPasteData',
    method: 'post',
    data: data
  })
}

// 粘贴覆盖数据
export function addPasteData(pubfldList) {
  return request({
    url: '/configuration/msg/addPasteData',
    method: 'put',
    data: pubfldList
  })
}
