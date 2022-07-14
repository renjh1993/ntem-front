import request from '@/utils/request'

// 查询自定义组件列表
export function listCmpCustom(query) {
  return request({
    url: '/system/cmpCustom/list',
    method: 'get',
    params: query
  })
}

// 查询自定义组件详细
export function getCmpCustom(cmpPk) {
  return request({
    url: '/system/cmpCustom/' + cmpPk,
    method: 'get'
  })
}

// 新增自定义组件
export function addCmpCustom(data) {
  return request({
    url: '/system/cmpCustom',
    method: 'post',
    data: data
  })
}

// 修改自定义组件
export function updateCmpCustom(data) {
  return request({
    url: '/system/cmpCustom',
    method: 'put',
    data: data
  })
}

// 删除自定义组件
export function delCmpCustom(cmpPk) {
  return request({
    url: '/system/cmpCustom/' + cmpPk,
    method: 'delete'
  })
}

// 导出自定义组件
export function exportCmpCustom(query) {
  return request({
    url: '/system/cmpCustom/export',
    method: 'get',
    params: query
  })
}