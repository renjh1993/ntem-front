import request from '@/utils/request'

// 查询协议访问参数列表
export function listAttr(query) {
  return request({
    url: '/configuration/attr/list',
    method: 'get',
    params: query
  })
}

// 查询协议访问参数详细
export function getAttr(bndProflPk) {
  return request({
    url: '/configuration/attr/' + bndProflPk,
    method: 'get'
  })
}

// 新增协议访问参数
export function addAttr(data) {
  return request({
    url: '/configuration/attr',
    method: 'post',
    data: data
  })
}

// 修改协议访问参数
export function updateAttr(data) {
  return request({
    url: '/configuration/attr',
    method: 'put',
    data: data
  })
}

// 删除协议访问参数
export function delAttr(bndProflPk) {
  return request({
    url: '/configuration/attr/' + bndProflPk,
    method: 'delete'
  })
}

// 导出协议访问参数
export function exportAttr(query) {
  return request({
    url: '/configuration/attr/export',
    method: 'get',
    params: query
  })
}

// 查询协议参数列表
export function listBnd(query) {
  return request({
    url: '/configuration/attr/bndList',
    method: 'get',
    params: query
  })
}
