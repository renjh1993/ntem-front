import request from '@/utils/request'
/**
 * 分页查询
 * @param {条件} query
 * @returns
 */
export function list(query) {
  return request({
    url: '/workflow/definition/list',
    method: 'get',
    params: query
  })
}

/**
 * 分页查询
 * @param {条件} query
 * @returns
 */
export function hisList(query) {
  return request({
    url: '/workflow/definition/hisList',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param {流程定义id} definitionId
 * @returns
 */
export function updateProcDefState(definitionId) {
  return request({
    url: '/workflow/definition/updateProcDefState/' + definitionId,
    method: 'put'
  })
}

/**
 * 按流程部署id删除
 * @param {deploymentId和definitionId} 流程部署id、流程定义id
 * @returns
 */
export function del(data) {
  return request({
    url: `/workflow/definition/delete`,
    method: 'post',
    data: data
  })
}

/**
 * 通过zip或xml部署流程定义
 * @returns
 */
export function deployProcessFile(data) {
  return request({
    url: '/workflow/definition/deployByFile',
    method: 'post',
    data: data
  })
}
// 查询流程定义配置信息
export function getProcessConfigByProcessKey(processKey) {
  return request({
    url: '/actFormConfig/' + processKey,
    method: 'get'
  })
}
// 流程定义配置信息
export function updateProcessConfig(data) {
  return request({
    url: '/actFormConfig',
    method: 'put',
    data: data
  })
}
export function setting(definitionId) {
  return request({
    url: '/workflow/definition/setting/' + definitionId,
    method: 'get'
  })
}

