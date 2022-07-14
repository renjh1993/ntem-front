import request from '@/utils/request'

// 查询组件分类列表
export function listCmpType(query) {
  return request({
    url: '/system/cmpType/list',
    method: 'get',
    params: query
  })
}

// 查询组件分类详细
export function getCmpType(cmpTypePk) {
  return request({
    url: '/system/cmpType/' + cmpTypePk,
    method: 'get'
  })
}

// 新增组件分类
export function addCmpType(data) {
  return request({
    url: '/system/cmpType',
    method: 'post',
    data: data
  })
}

// 修改组件分类
export function updateCmpType(data) {
  return request({
    url: '/system/cmpType',
    method: 'put',
    data: data
  })
}

// 删除组件分类
export function delCmpType(cmpTypePk) {
  return request({
    url: '/system/cmpType/' + cmpTypePk,
    method: 'delete'
  })
}

// 导出组件分类
export function exportCmpType(query) {
  return request({
    url: '/system/cmpType/export',
    method: 'get',
    params: query
  })
}