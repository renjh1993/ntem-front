import request from '@/utils/request'

export function listCmp(typeCd) {
  return request({
    url: '/system/cmpDef/getComponentByType?typeCd=' + typeCd,
    method: 'get'
  })
}

export function getCmpPk(flowId) {
  return request({
    url: '/system/cmpDef/getCmpPkByFlow?flowId=' + flowId,
    method: 'get'
  })
}

export function getCmpDef(cmpPk) {
  return request({
    url: '/system/cmpDef/' + cmpPk,
    method: 'get'
  })
}
