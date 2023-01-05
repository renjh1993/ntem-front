import Vue from 'vue'
import LoadingComponent from './loading.vue'

const Loading = {}
let showLoading = false // 存储loading显示状态
let loadingNode = null // 存储loading节点元素
const LoadingConstructor = Vue.extend(LoadingComponent)

Loading.install = function(Vue) {
  Vue.prototype.$myloading = function(tips, method) {
    console.log('aaa')
    if (method === 'hide') {
      loadingNode.isShowLoading = showLoading = false
    } else {
      if (showLoading) {
        return
      }

      loadingNode = new LoadingConstructor({
        data: {
          isShowLoading: showLoading,
          content: tips

        }
      })
      loadingNode.$mount()
      document.body.appendChild(loadingNode.$el)
      loadingNode.isShowLoading = showLoading = true
    }
  };

  ['show', 'hide'].forEach(function(method) {
    Vue.prototype.$myloading[method] = function(tips) {
      return Vue.prototype.$myloading(tips, method)
    }
  })
}

export default Loading
