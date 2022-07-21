import request from '@/utils/request'

// 查询请假列表
export function listMzctj(query) {
  return request({
    url: '/workflowMzctj/list',
    method: 'get',
    params: query
  })
}
// 查询请假列表
export function listMzctjAll(query) {
  return request({
    url: '/workflowMzctj/listAll',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getMzctj(id) {
  return request({
    url: '/workflowMzctj/getOne/' + id,
    method: 'get'
  })
}


// 新增请假
export function addMzctj(data) {
  return request({
    url: '/workflowMzctj/add',
    method: 'post',
    data: data
  })
}
// 存为草稿
export function draft(data) {
  return request({
    url: '/workflowMzctj/draft',
    method: 'post',
    data: data
  })
}
// 修改请假
export function updateMzctj(data) {
  return request({
    url: '/workflowMzctj',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delMzctj(data) {
  return request({
    url: '/workflowMzctj/del',
    
    method: 'post',
    data: data
  })
}

// 导出请假
export function exportMzctj(query) {
  return request({
    url: '/workflowMzctj/export',
    method: 'get',
    params: query
  })
}
