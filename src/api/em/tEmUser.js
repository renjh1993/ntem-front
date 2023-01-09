import request from '@/utils/request'

// 查询列表
export function query(query) {
  return request({
    url: '/emuser/tEmUser/query',
    method: 'get',
    params: query
  })
}

// 查询履历列表
export function programDetails(query) {
  return request({
    url: '/emuser/tEmProgram/query',
    headers: {
      isToken: true
    },
    method: 'get',
    params: query
  })
}

// 查询详细信息
export function getOne(query) {
  return request({
    url: '/emuser/tEmUser/getOne',
    method: 'get',
    params: query
  })
}

// 查询技能详细信息
export function getOnejn(query) {
  return request({
    url: '/emuser/tEmUserSkill/getOne',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/emuser/tEmUser/create',
    method: 'post',
    data: data
  })
}

// 提交修改已结束流程
export function edit(data) {
  return request({
    url: '/emuser/tEmUser/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function del(data) {
  return request({
    url: '/emuser/tEmUser/remove',
    method: 'post',
    data: data
  })
}

// 删除技能
export function delSkill(data) {
  return request({
    url: '/emuser/tEmUserSkill/remove',
    method: 'post',
    data: data
  })
}

// 更新
export function update(data) {
  return request({
    url: '/emuser/tEmUser/update',
    method: 'post',
    data: data
  })
}

// 更新
export function updateSkill(data) {
  return request({
    url: '/emuser/tEmUserSkill/update',
    method: 'post',
    data: data
  })
}

// 存为草稿
export function draft(data) {
  return request({
    url: '/emuser/tEmUser/draft',
    method: 'post',
    data: data
  })
}

// 导出excel
export function exportExcel(query) {
  return request({
    url: '/emuser/tEmUser/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/emuser/tEmUser/importTemplate',
    method: 'get'
  })
}

export default {
  query,
  programDetails,
  getOne,
  add,
  del,
  delSkill,
  draft,
  edit,
  update,
  updateSkill,
  exportExcel,
  importTemplate,
  getOnejn
}
