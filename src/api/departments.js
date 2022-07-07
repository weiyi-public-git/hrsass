import request from '@/utils/request'
/** **
 *
 *  获取组织架构的数据
 *
 */
export function getDepartments() {
  // 在钩子函数中调用接口
  return request({
    url: '/company/department'
  })
}
