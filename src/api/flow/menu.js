import request from '@/utils/request'

// export function setProperty(data) {
//   return request({
//     url: '/dmip_flow/node/setProperty',
//     method: 'post',
//     data: data
//   })
// }
//
// export function getProperty(data) {
//   return request({
//     url: '/dmip_flow/node/getProperty',
//     method: 'get',
//     params: { ...data }
//   })
// }
// export function setProperty(data) {
//   return request({
//     url: '/dmip_flow/node/setProperty',
//     method: 'post',
//     data: data
//   })
// }

// 获取流程组件参数信息
export function getFlowTplCmpParams(data) {
  return request({
    url: '/flow/searchFlowTplCmpParams?flowTplPk=' + data.flowTplPk + '&flowTplCmpId=' + data.flowTplCmpId,
    method: 'get'
  })
}
// 获取流程组件信息
export function getFlowTplCmp(data) {
  return request({
    url: '/flow/getTplCmp?tplPk=' + data.flowTplPk + '&tplCmpId=' + data.flowTplCmpId,
    method: 'get'
  })
}

export function searchCmpParams(beanName) {
  return request({
    url: '/flow/searchCmpParams?beanName=' + beanName,
    method: 'get'
  })
}
