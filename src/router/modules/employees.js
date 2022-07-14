// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由规则 /emploees
  name: 'employees', // 给模块的一级路由加一个name属性, 这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不写的时候 此时它表示二级的默认路由
    path: '', // 这里不用写,什么都不写表示 /employees 不但有布局 layout => 员工主页
    component: () => import('@/views/employees'),
    name: 'employees',
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '员工管理', // 这里为什么要用title 因为左侧导航读取了这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // ?的含义表示该参数可传可不传 动态路由参数 /employees/detail/123
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  },
  {
    path: 'print/:id', // 默认二级路由
    component: () => import('@/views/employees/print'), // 按需加载
    hidden: true,
    meta: {
      title: '打印' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }
  ]
}
