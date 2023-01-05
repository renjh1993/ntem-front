import request from '@/utils/request'

// 查询服务接口列表
export function listIntf(query) {
  return request({
    url: '/system/intf/list',
    method: 'get',
    params: query
  })
}

// 查询服务接口详细
export function getIntf(svcIntfPk) {
  return request({
    url: '/system/intf/' + svcIntfPk,
    method: 'get'
  })
}

// 新增服务接口
export function addIntf(data) {
  return request({
    url: '/system/intf',
    method: 'post',
    data: data
  })
}

// 修改服务接口
export function updateIntf(data) {
  return request({
    url: '/system/intf',
    method: 'put',
    data: data
  })
}

// 删除服务接口
export function delIntf(svcIntfPk) {
  return request({
    url: '/system/intf/' + svcIntfPk,
    method: 'delete'
  })
}

// 导出服务接口
export function exportIntf(query) {
  return request({
    url: '/system/intf/export',
    method: 'get',
    params: query
  })
}
