import request from '@/utils/request'

// 查询INTF报文转换规则组列表
export function listRg(query) {
  return request({
    url: '/system/transfRg/list',
    method: 'get',
    params: query
  })
}

// 查询INTF报文转换规则组详细
export function getRg(transfRgPk) {
  return request({
    url: '/system/transfRg/' + transfRgPk,
    method: 'get'
  })
}

// 新增INTF报文转换规则组
export function addRg(data) {
  return request({
    url: '/system/transfRg',
    method: 'post',
    data: data
  })
}

// 修改INTF报文转换规则组
export function updateRg(data) {
  return request({
    url: '/system/transfRg',
    method: 'put',
    data: data
  })
}

// 删除INTF报文转换规则组
export function delRg(transfRgPk) {
  return request({
    url: '/system/transfRg/' + transfRgPk,
    method: 'delete'
  })
}

// 导出INTF报文转换规则组
export function exportRg(query) {
  return request({
    url: '/system/transfRg  /export',
    method: 'get',
    params: query
  })
}
