const start = require('../../../assets/flow/icons/流程开始icon.svg')
const end = require('../../../assets/flow/icons/流程结束icon.svg')
const decssion = require('../../../assets/flow/icons/分支icon.svg')
const concurrent = require('../../../assets/flow/icons/并发开始icon.svg')
const concurrentEnd = require('../../../assets/flow/icons/并发结束icon.svg')
const localtrans = require('../../../assets/flow/icons/本地事务开始icon.svg')
const localtransEnd = require('../../../assets/flow/icons/本地事务结束icon.svg')
const globaltrans = require('../../../assets/flow/icons/全局事务开始icon.svg')
const globaltransEnd = require('../../../assets/flow/icons/全局事务结束icon.svg')
const recycle = require('../../../assets/flow/icons/循环开始icon.svg')
const recycleEnd = require('../../../assets/flow/icons/循环结束icon.svg')
const self = require('../../../assets/flow/icons/自定义icon.svg')
const submode = require('../../../assets/flow/icons/子模块icon.svg')
const stateOk = require('../../../assets/flow/icons/ok.svg')
const pubbasecmp = require('../../../assets/flow/icons/公共技术组件icon.svg')
const pubbusicmp = require('../../../assets/flow/icons/公共业务组件icon.svg')
/*
const strBase64 = function (data) {
  // 对字符串进行编码
  var encode = encodeURI(data)
  // 对编码的字符串转化base64
  var base64 = btoa(encode)
  return 'data:image/svg+xml;base64,' + base64
}
*/
const svgBase64 = {
  start: start,
  end: end,
  decssion: decssion,
  concurrent: concurrent,
  concurrentEnd: concurrentEnd,
  localtrans: localtrans,
  localtransEnd: localtransEnd,
  globaltrans: globaltrans,
  globaltransEnd: globaltransEnd,
  recycle: recycle,
  recycleEnd: recycleEnd,
  self: self,
  submode: submode,
  stateOk: stateOk,
  pubbasecmp: pubbasecmp,
  pubbusicmp: pubbusicmp
}

export default svgBase64
