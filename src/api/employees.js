import request from '@/utils/request'

/** *
 * 获取员工简单列表
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
/** **
 * 获取员工综合列表
 */
export function getEmployeesList(params) {
  return request({
    url: '/sys/user/',
    params
  })
}
