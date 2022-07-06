// 导出一个axios的实例,而且这个实例要有请求拦截器,响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
// 创建实例,可以使用自定义配置新建一个 axios 实例
const service = axios.create({
// 当执行 npm run dev => .env.devlopment => /api => 跨域代理
// 如果执行 npm run dev 值为 .api 正确 .api 这个代理只是给开发环境配置的代理
// 如果执行 npm run build 值为 /prod-api 没关系 运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // /dev-api /prod-api
  timeout: 5000 // 设置超时时间
})
// 创建一个axios的实例
// interceptors(拦截器): 在请求或响应应被 then 和 catch处理前拦截它们
service.interceptors.request.use()
// 请求拦截器
service.interceptors.response.use(response => {
  // axios 默认加了一层data
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误消息
    return Promise.error(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行成功,让当前的执行链跳出成功 直接进入catch
})
// 响应拦截器
export default service
// 导出axios实例
