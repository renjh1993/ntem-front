import request from '@/utils/request'

// 查询组件定义列表
export function listComp(query) {
  return request({
    url: '/configuration/comp/list',
    method: 'get',
    params: query
  })
}

// 查询组件定义详细
export function getComp(compPk) {
  return request({
    url: '/configuration/comp/' + compPk,
    method: 'get'
  })
}

// 新增组件定义
export function addComp(data) {
  return request({
    url: '/configuration/comp',
    method: 'post',
    data: data
  })
}

// 修改组件定义
export function updateComp(data) {
  return request({
    url: '/configuration/comp',
    method: 'put',
    data: data
  })
}

// 删除组件定义
export function delComp(compPk) {
  return request({
    url: '/configuration/comp/' + compPk,
    method: 'delete'
  })
}

// 导出组件定义
export function exportComp(query) {
  return request({
    url: '/configuration/comp/export',
    method: 'get',
    params: query
  })
}
