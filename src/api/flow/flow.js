import request from '@/utils/request'

export function addFlow(form) {
  return request({
    url: '/flow/newFlowTpl',
    method: 'post',
    params: {
      tplName: form.name,
      tplType: form.type,
      sDesc: form.desc
    }
  })
}

export function saveFlowTpl(data) {
  return request({
    url: '/flow/saveFlowTpl',
    method: 'post',
    data: data
  })
}

export function saveFlowTplCmpParams(data) {
  return request({
    url: '/flow/saveFlowTplCmpParams',
    method: 'post',
    data: data.cmpParams,
    params: {
      flowTplPk: data.flowTplPk,
      flowTplCmpId: data.flowTplCmpId
    }
  })
}

export function getFlowList(query) {
  return request({
    url: '/flow/flowList',
    method: 'get',
    params: query
  })
}

export function getTemplateByPk(flowTplPk) {
    return request({
      url: '/flow/getTemplateByTplPk?flowTplPk=' + flowTplPk,
      method: 'get'
    })
}
