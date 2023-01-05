import request from '@/utils/request'

// 查询内外交易码映射列表
export function listTranscode(query) {
  return request({
    url: '/system/transcode/list',
    method: 'get',
    params: query
  })
}

// 查询内外交易码映射详细
export function getTranscode(id) {
  return request({
    url: '/system/transcode/' + id,
    method: 'get'
  })
}

// 新增内外交易码映射
export function addTranscode(data) {
  return request({
    url: '/system/transcode',
    method: 'post',
    data: data
  })
}

// 修改内外交易码映射
export function updateTranscode(data) {
  return request({
    url: '/system/transcode',
    method: 'put',
    data: data
  })
}

// 删除内外交易码映射
export function delTranscode(id) {
  return request({
    url: '/system/transcode/' + id,
    method: 'delete'
  })
}

// 导出内外交易码映射
export function exportTranscode(query) {
  return request({
    url: '/system/transcode/export',
    method: 'get',
    params: query
  })
}
