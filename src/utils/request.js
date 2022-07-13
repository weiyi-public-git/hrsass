// 导出一个axios的实例,而且这个实例要有请求拦截器,响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间

// 创建实例,可以使用自定义配置新建一个 axios 实例
const service = axios.create({
// 当执行 npm run dev => .env.devlopment => /api => 跨域代理
// 如果执行 npm run dev 值为 .api 正确 .api 这个代理只是给开发环境配置的代理
// 如果执行 npm run build 值为 /prod-api 没关系 运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // /dev-api /prod-api
  timeout: 50000 // 设置超时时间
})
// 创建一个axios的实例
// interceptors(拦截器): 在请求或响应应被 then 和 catch处理前拦截它们
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})
// 请求拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    // 此时认为业务执行成功了
    return data // 返回用户所需要的数据
  } else {
    // 当业务失败的时候
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, async error => {
  // error 有response对象 config
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉前端token超时了
    await store.dispatch('user/lgout') // 调用登出action
    router.push('/login') // 跳到登录页
  }
  // 失败
  // Message等同于 this.$message
  Message.error(error.message) // 提示错误
  // reject
  return Promise.reject(error) // 传入一个错误的对象  就认为promise执行链 进入了catch
})
// 响应拦截器

// 是否超时
// 超时逻辑 (当前时间 - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
// 导出axios实例
