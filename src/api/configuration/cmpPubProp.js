import request from '@/utils/request'

// 查询组件公共属性表列表
export function listCmpPubProp(query) {
  return request({
    url: '/configuration/cmpPubProp/list',
    method: 'get',
    params: query
  })
}

// 查询组件公共属性表详细
export function getCmpPubProp(cmpPropPk) {
  return request({
    url: '/configuration/cmpPubProp/' + cmpPropPk,
    method: 'get'
  })
}

// 新增组件公共属性表
export function addCmpPubProp(data) {
  return request({
    url: '/configuration/cmpPubProp',
    method: 'post',
    data: data
  })
}

// 修改组件公共属性表
export function updateCmpPubProp(data) {
  return request({
    url: '/configuration/cmpPubProp',
    method: 'put',
    data: data
  })
}

// 删除组件公共属性表
export function delCmpPubProp(cmpPropPk) {
  return request({
    url: '/configuration/cmpPubProp/' + cmpPropPk,
    method: 'delete'
  })
}

// 导出组件公共属性表
export function exportCmpPubProp(query) {
  return request({
    url: '/configuration/cmpPubProp/export',
    method: 'get',
    params: query
  })
}
