import request from '@/utils/request'

export function searchSvcFlowCmpParams(data) {
  return request({
    url: '/svcFlow/searchSvcFlowCmpParams?transCode=' + data.transCode + '&flowCmpId=' + data.flowCmpId,
    method: 'get'
  })
}

export function saveSvcFlowCmpParams(data) {
  return request({
    url: '/svcFlow/saveSvcFlowCmpParams',
    method: 'post',
    data: data.svcFlowCmpParams,
    params: {
      transCode: data.transCode,
      flowCmpId: data.flowCmpId
    }
  })
}
