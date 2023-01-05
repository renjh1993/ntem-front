import request from '@/utils/request'

// 查询列表
export function listPubfld(query) {
  return request({
    url: '/system/fmtPubfld/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addPubfld(data) {
  return request({
    url: '/system/fmtPubfld',
    method: 'post',
    data: data
  })
}

// 删除
export function delPubfld(fmtPubfldPk) {
  return request({
    url: '/system/fmtPubfld/' + fmtPubfldPk,
    method: 'delete'
  })
}

// 查询详情
export function getPubfld(fmtPubfldPk) {
  return request({
    url: '/system/fmtPubfld/' + fmtPubfldPk,
    method: 'get'
  })
}

// 修改
export function updatePubfld(data) {
  return request({
    url: '/system/fmtPubfld',
    method: 'put',
    data: data
  })
}

// 获取公共域列表
export function listPub() {
  return request({
    url: '/system/fmtPubfld/publist',
    method: 'get'
  })
}

// 判断是否存在当前报文
export function isExistPub(pubfldname) {
  return request({
    url: '/system/fmtPubfld/isExistPub/' + pubfldname,
    method: 'get'
  })
}

// 粘贴覆盖数据
export function addPasteData(pubfldList) {
  return request({
    url: '/system/fmtPubfld/addPasteData',
    method: 'put',
    data: pubfldList
  })
}

// 粘贴进的数据
export function newPasteData(currentPid, currentPubfldName, pasteArr, selectProps) {
  const data = {
    currentPid,
    currentPubfldName,
    pasteArr,
    selectProps
  }
  return request({
    url: '/system/fmtPubfld/newPasteData',
    method: 'post',
    data: data
  })
}

// 批量修改pid
export function batchUpdatePid(parentId, ids) {
  const data = {
    parentId,
    ids
  }
  return request({
    url: '/system/fmtPubfld/batchUpdatePid',
    method: 'post',
    data: data
  })
}
