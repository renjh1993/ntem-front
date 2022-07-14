import request from '@/utils/request'

// 查询组件定义列表
export function listCmpDef(query) {
  return request({
    url: '/system/cmpDef/list',
    method: 'get',
    params: query
  })
}

// 查询组件定义详细
export function getCmpDef(cmpPk) {
  return request({
    url: '/system/cmpDef/' + cmpPk,
    method: 'get'
  })
}

// 新增组件定义
export function addCmpDef(data) {
  return request({
    url: '/system/cmpDef',
    method: 'post',
    data: data
  })
}

// 修改组件定义
export function updateCmpDef(data) {
  return request({
    url: '/system/cmpDef',
    method: 'put',
    data: data
  })
}

// 删除组件定义
export function delCmpDef(cmpPk) {
  return request({
    url: '/system/cmpDef/' + cmpPk,
    method: 'delete'
  })
}

// 导出组件定义
export function exportCmpDef(query) {
  return request({
    url: '/system/cmpDef/export',
    method: 'get',
    params: query
  })
}