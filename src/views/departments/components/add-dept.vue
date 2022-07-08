<template>
  <!-- 放置 新增部门 的弹层组件 -->
  <!-- visible 默认显示组件 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单组件 label-width 设置所有标题的宽度-->
    <el-form :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native修饰符 可以找到原生属性的事件 -->
        <el-select v-model="formData.manager" style="width:80%;" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项  这里做一下简单的处理 显示的是用户名 存的也是用户名 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%;" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽 具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button type="primary" size="small">确定</el-button>
      </el-col>
    </el-row>
    <!-- 确定和消息 -->
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 需要传递一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级部门下的部门去比较 有没有相同的 有相同的 不能过 / 不相同就可以过
      // 返回一个promise对象
      const { depts } = await getDepartments()
      // 去找同级下 有没有和value相同的数据
      // 找到同级部门所有的子部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }

    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构下已经有部门使用${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trgger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trgger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trgger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trgger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trgger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trgger: 'blur' }]
      }, // 校验规则 { key:数组 }
      peoples: []
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    }
  }
}
</script>

<style>
</style>
