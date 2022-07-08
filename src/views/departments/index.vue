<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容,插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据 data 每个节点的数据对象 -->
          <TreeTools slot-scope="{data}" :tree-node="data" @addDepts="addDepts" @editDepts="editDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
// 当标签为label的时候,子节点为children的时候,下面语句可以省略
// label: 'label'
// children: 'children'
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: {}, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 表示从这个属性显示内容
      },
      showDialog: false, // 默认不显示弹层
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化为树形结构
    },

    // 监听tree-tools中触发的点击添加子部门的事件
    // node 是我们当前点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 显示新增组件弹层
      this.node = node // 存储传递过来的node数据
      // 在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      console.log(this.$refs.addDept)
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件的一个方法 传入一个id
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
