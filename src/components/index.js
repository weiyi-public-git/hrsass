// 负责所有全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
  install(Vue) { // Vue的实例对象
    // 完成组件的注册
    // 语法 Vue.component('名称',对象)
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
// Vue.use()
