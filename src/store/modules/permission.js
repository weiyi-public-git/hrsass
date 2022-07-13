// 通过解构的方式导入静态路由
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  // 所有用户都拥有静态路由权限
  routes: constantRoutes // 路由表 表示 当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload 认为是我们登录成功需要添加的路由
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes] 这么写业务不正确
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由的基础上去加新的路由
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户所拥有的菜单权限
  filterRoutes(context, menus) {
    // forEach方法对数组的每个元素执行一次给定的函数
    const routes = [] // 定义一个空数组接收
    // 筛选出 动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes 找到对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))
      // 筛选后的数组只有解构才可以push到数组中
      // 这里得到筛选后的数组, 可能有元素,也可能是空数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return state数据 是用来显示左侧菜单用的 return 是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
