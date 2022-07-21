import request from '@/utils/request'

// 查询民族社区基本情况列表
export function listNationChe(query) {
  return request({
    url: '/nationCHE/list',
    method: 'get',
    params: query
  })
}

// 查询民族社区基本情况列表
export function listNationCheAll(query) {
  return request({
    url: '/nationCHE/listAll',
    method: 'get',
    params: query
  })
}

// 查询民族社区基本情况详细
export function getNationChe(id) {
  return request({
    url: '/nationCHE/getOne/' + id,
    method: 'get'
  })
}

// 新增民族社区基本情况
export function addNationChe(data) {
  return request({
    url: '/nationCHE/add',
    method: 'post',
    data: data
  })
}

// 存为草稿
export function draft(data) {
  return request({
    url: '/nationCHE/draft',
    method: 'post',
    data: data
  })
}

// 更新民族社区基本情况
export function updateNationChe(data) {
  return request({
    url: '/nationCHE/update',
    method: 'post',
    data: data
  })
}

// 删除民族社区基本情况
export function delNationChe(data) {
  return request({
    url: '/nationCHE/del',
    method: 'post',
    data: data
  })
}

// 修改已结束流程的
export function editNationChe(data) {
  return request({
    url: '/nationCHE/edit',
    method: 'post',
    data: data
  })
}

// 导出民族社区基本情况
export function exportNationChe(query) {
  return request({
    url: '/nationCHE/export',
    method: 'get',
    params: query
  })
}