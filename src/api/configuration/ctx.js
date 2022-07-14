import request from '@/utils/request'

// 查询服务访问场景列表
export function listCtx(query) {
  return request({
    url: '/system/ctx/list',
    method: 'get',
    params: query
  })
}

// 查询服务访问场景详细
export function getCtx(svcCtxPk) {
  return request({
    url: '/system/ctx/' + svcCtxPk,
    method: 'get'
  })
}

// 新增服务访问场景
export function addCtx(data) {
  return request({
    url: '/system/ctx',
    method: 'post',
    data: data
  })
}

// 修改服务访问场景
export function updateCtx(data) {
  return request({
    url: '/system/ctx',
    method: 'put',
    data: data
  })
}

// 删除服务访问场景
export function delCtx(svcCtxPk) {
  return request({
    url: '/system/ctx/' + svcCtxPk,
    method: 'delete'
  })
}

// 导出服务访问场景
export function exportCtx(query) {
  return request({
    url: '/system/ctx/export',
    method: 'get',
    params: query
  })
}