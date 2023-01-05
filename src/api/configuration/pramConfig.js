import request from '@/utils/request'

// 查询组件参数配置列表
export function listPramConfig(query) {
  return request({
    url: '/system/pramConfig/list',
    method: 'get',
    params: query
  })
}

// 查询组件参数配置详细
export function getPramConfig(cmpParaPk) {
  return request({
    url: '/system/pramConfig/' + cmpParaPk,
    method: 'get'
  })
}

// 新增组件参数配置
export function addPramConfig(data) {
  return request({
    url: '/system/pramConfig',
    method: 'post',
    data: data
  })
}

// 修改组件参数配置
export function updatePramConfig(data) {
  return request({
    url: '/system/pramConfig',
    method: 'put',
    data: data
  })
}

// 删除组件参数配置
export function delPramConfig(cmpParaPk) {
  return request({
    url: '/system/pramConfig/' + cmpParaPk,
    method: 'delete'
  })
}

// 导出组件参数配置
export function exportPramConfig(query) {
  return request({
    url: '/system/pramConfig/export',
    method: 'get',
    params: query
  })
}
