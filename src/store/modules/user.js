import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候,就先从缓存中读取
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = { ...result } // 这样也是响应式,浅拷贝
    // state.userInfo['username'] = result // 这样才不是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login action 也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    // 调用api接口
    // 拿到token
    const result = await login(data) // 实际上就是一个promise result就是执行的结果
    // axios 默认给数据加了一层data
    // 设置token
    context.commit('setToken', result)
    // 拿到token说明登录成功了
    setTimeStamp() // 设置当前的时间戳
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情 用户的详情数据
    // result--获取用户基本信息(包括了用户id)
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    // const obj = { ...result, ...baseInfo } ---- 等同于下方
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 这里为什么要return呢,这里是给我们后期做权限的时候,留下的伏笔
  },
  // 登出的操作
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的,还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 去设置权限模块下路由初始状态
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下 所有的mutation和action都是挂在全局上的 所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的comtext指的不是全局的context
    // mutations名称 载荷  payload 第三个参数 { root: true } 调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
