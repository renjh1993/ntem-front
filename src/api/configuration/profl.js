import request from '@/utils/request'

// 查询ESB访问服务提供方的协议概要列表
export function listProfl(query) {
  return request({
    url: '/system/bndProfl/list',
    method: 'get',
    params: query
  })
}

// 查询ESB访问服务提供方的协议概要详细
export function getProfl(bndProflPk) {
  return request({
    url: '/system/bndProfl/' + bndProflPk,
    method: 'get'
  })
}

// 新增ESB访问服务提供方的协议概要
export function addProfl(data) {
  return request({
    url: '/system/bndProfl/add',
    method: 'post',
    data: data
  })
}

// 修改ESB访问服务提供方的协议概要
export function updateProfl(data) {
  return request({
    url: '/system/bndProfl/edit',
    method: 'put',
    data: data
  })
}

// 删除ESB访问服务提供方的协议概要
export function delProfl(bndProflPk) {
  return request({
    url: '/system/bndProfl/' + bndProflPk,
    method: 'delete'
  })
}

// 导出ESB访问服务提供方的协议概要
export function exportProfl(query) {
  return request({
    url: '/system/bndProfl/export',
    method: 'get',
    params: query
  })
}
