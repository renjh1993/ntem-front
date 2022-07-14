import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listHis(query) {
  return request({
    url: '/configuration/his/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getHis(revisionHisPk) {
  return request({
    url: '/configuration/his/' + revisionHisPk,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addHis(data) {
  return request({
    url: '/configuration/his',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateHis(data) {
  return request({
    url: '/configuration/his',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delHis(revisionHisPk) {
  return request({
    url: '/configuration/his/' + revisionHisPk,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportHis(query) {
  return request({
    url: '/configuration/his/export',
    method: 'get',
    params: query
  })
}
