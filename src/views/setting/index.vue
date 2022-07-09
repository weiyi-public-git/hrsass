<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧的内容 -->
            <el-row style="height:60px ;">
              <!-- 新增角色按钮 -->
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 / 给表格绑定数据-->
            <el-table border="" :data="list">
              <el-table-column type="index" align="center" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="名称" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px;">
              <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" :closable="false" show-icon="" />
            <!-- 右侧内容 -->
            <!-- 并不是所有表单都需要 model rules -->
            <el-form label-width="120px" style="margin-top: 50px;">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width: 400px;" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <!-- close事件 在点击确定的时候会触发 -->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <!-- 表单校验--绑定 属性:model && 属性:rules -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 100,
        total: 0 // 记录总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 控制弹层显示
      roleForm: {
        name: '', // 角色名称
        description: '' // 角色描述
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() //
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page) // 对返回数据进行解构
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId) // 直接赋值给formData
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗?')
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功!')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据回写
      this.showDialog = true // 显示弹层
    },
    async btnOK() {
      try {
        // 表单校验
        await this.$refs.roleForm.validate()
        // validate的参数为一个回调函数,若不传入回调函数,默认返回一个promise
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是i新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false // 关闭弹层 => 触发el-dialog的事件close事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
