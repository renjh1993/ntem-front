import request from '@/utils/request'

// 查询提供方组件列表
export function listCompCtxBnd(query) {
  return request({
    url: '/system/compCtxBnd/list',
    method: 'get',
    params: query
  })
}
export function listTmp(query) {
  return request({
    url: '/system/compCtxBnd/getTmpList',
    method: 'get',
    params: query
  })
}

// 查询提供方组件详细
export function getCompCtxBnd(compCtxBndId) {
  return request({
    url: '/system/compCtxBnd/' + compCtxBndId,
    method: 'get'
  })
}

// 新增提供方组件
export function addCompCtxBnd(data) {
  return request({
    url: '/system/compCtxBnd',
    method: 'post',
    data: data
  })
}

// 修改提供方组件
export function updateCompCtxBnd(data) {
  return request({
    url: '/system/compCtxBnd',
    method: 'put',
    data: data
  })
}

// 删除提供方组件
export function delCompCtxBnd(compCtxBndId) {
  return request({
    url: '/system/compCtxBnd/' + compCtxBndId,
    method: 'delete'
  })
}

// 导出提供方组件
export function exportCompCtxBnd(query) {
  return request({
    url: '/system/compCtxBnd/export',
    method: 'get',
    params: query
  })
}
