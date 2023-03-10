import request from '@/utils/request'
import { downLoadZip } from '@/utils/zipdownload'

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

// 查询技能详细信息
export function getOnejl(query) {
  return request({
    url: '/emuser/tEmProgram/getOne',
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

// 删除项目履历
export function delProgram(data) {
  return request({
    url: '/emuser/tEmProgram/remove',
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

// 更新
export function updateProgram(data) {
  return request({
    url: '/emuser/tEmProgram/update',
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

// 下载员工履历导入模板
export function importProgramTemplate() {
  return request({
    url: '/emuser/tEmProgram/importProgramTemplate',
    method: 'get'
  })
}

function uploadAttachment(data) {
  return request({
    url: '/annexInfo/tEmAnnexinfo/upload',
    method: 'post',
    data: data,
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}

export default {
  query,
  programDetails,
  getOne,
  add,
  del,
  delSkill,
  delProgram,
  draft,
  edit,
  update,
  updateSkill,
  updateProgram,
  exportExcel,
  importTemplate,
  importProgramTemplate,
  getOnejn,
  getOnejl,
  uploadAttachment,
  queryAttachment(userid) {
    return request({
      url: `/annexInfo/tEmAnnexinfo/query/${userid}`,
      method: 'get'
    })
  },
  exportResume(type, ids) {
    downLoadZip(`/emuser/tEmUser/download/resume?type=${type}&ids=${ids}`, '简历.zip')
  }
}
