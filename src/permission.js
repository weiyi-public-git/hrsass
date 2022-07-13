// 权限拦截在导航守卫.

import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next是前置守卫必须必须执行的钩子  next 必须执行 不执行 页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址)  跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页
      next('./') // 跳到主页
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户的资料没有被获取
        // async 函数所return的内容 用 await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // 调用permission模块下的, dispatch
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的动态路由
        // routes就是筛选得到的动态路由
        // console.log(routes)
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        router.addRoutes([...routes], { path: '*', redirect: '/404', hidden: true }) // 添加动态路由到路由表
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址 相当于多做一次跳转 为什么要多做一次跳转
      } else {
        next() // 放行
      }
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 解决手动切换地址时, 进度条不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
