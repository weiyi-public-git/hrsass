// 负责所有全局自定义组件的注册
import PageTools from './PageTools'
export default {
  install(Vue) { // Vue的实例对象
    // 完成组件的注册
    Vue.component('PageTools', PageTools)
  }
}
// Vue.use()
