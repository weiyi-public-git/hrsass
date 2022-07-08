<template>
  <el-row
    slot-scope="{ treeNode }"
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <!-- 右侧内容 -->
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  // props可以用数组来接收数据 也可以用对象来接收
  // props: { props属性: {  配置选项 }}
  props: {
    // 定义传入的属性
    treeNode: {
      required: true, // 对象类型
      type: Object // 要求对方使用您的组件的时候,必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 点击 编辑 删除 新增时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加部门
      } else if (type === 'edit') {
        // 编辑部门
      } else {
        // 删除部门
        this.$confirm('您确定要删除该组织部门吗').then(() => {
          return delDepartment(this.treeNode.id)
        }).then(() => {
          // 响应拦截器已经处理了失败异常,不需要catch,只需要等到成功的时候,调用接口删除了,后端数据变化了,前端没变
          this.$emit('delDepts') // 触发一个自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>
</style>
