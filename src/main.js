import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'
import * as directives from '@/directives'
import * as filters from '@/filters'
import checkPermission from '@/mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 转化为数组
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
  // 在管理自定义指令中取出每一个指令
})
// 每一个键名表示自定义指令的方法名称
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) // 注册自定义的过滤器
})

// 注册自定义组件
Vue.use(Components)
// 全局混入对象
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
