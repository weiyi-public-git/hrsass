<template>
  <!-- 放置 新增部门 的弹层组件 -->
  <!-- visible 默认显示组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件 label-width 设置所有标题的宽度-->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
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
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
    <!-- 确定和消息 -->
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartments, getDepartDetail, updateDepartment } from '@/api/departments'
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
    // 定义一个函数 这个函数的目的,去找同级部门下,检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 先获取最新的组织架构数据
      // 返回一个promise对象
      const { depts } = await getDepartments()
      let isRepeat = false
      // depts是所有的部门数据
      // 检查重复规则 需要支持两种模式 新增模式 / 编辑模式
      // 如何去找技术部所有的子节点
      if (this.formData.id) {
        // 有id就是编辑模式
        // 同级部门下 我的名字不能和其他的同级部门的名字进行重复
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }

    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是
      if (this.formData.id) {
        // 要求不能有一样的编码
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
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
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法 先设置了 node 数据 直接调用方法
      // props传值是异步的
    },
    btnOK() {
      // 手动校验表单
      // 获取el-form的实例
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 根据表单中有没有id进行判断,新增部门或者编辑部门
          if (this.formData.id) {
            // 编辑部门
            await updateDepartment(this.formData)
          } else {
            // 新增部门
            // 调用新增接口添加父部门的id
            await addDepartments({ ...this.formData, pid: this.treeNode.pid })
          }
          // 表单校验通过

          // 告诉父组件 更新数据
          this.$emit('addDepts') // 触发一个自定义事件
          // 此时应该去修改showDialog值
          // 固定写法: update: props名称
          // this.$emit('changeDialog', false)
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会 触发el-dialog的时候
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验 可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>
</style>
