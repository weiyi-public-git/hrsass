import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是组件的选项
  methods: {
    // 检查权限 key就是要检查的点
    checkPermission(key) {
      // 去用户的信息里面找 points中有没有key 如果有key 则认为有权限 如果没有key则认为不能点
      store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没进去 说明没权限
    }
  }
}
