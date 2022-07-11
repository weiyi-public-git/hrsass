<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--放置一个卡片 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px;margin-top: 30px;">
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px ;" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 300px;" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <!-- <user-info /> -->
            <component :is="UserComponent" />
            <!-- 动态组件: 可以切换组件 -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置内容 -->
            <!-- <job-info /> -->
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id, // 直接将路由中的data属性赋值给data中的属性
      userInfo: {
        // 专门存放基本信息
        username: '',
        password2: '' // 读取出来的password是密文
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur ' },
          { min: 6, max: 9, message: '密码在6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
      console.log(this.userInfo)
    },
    saveUser() {
      // 调用方法时,应该校验
      this.$refs.userForm.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('修改用户信息成功')
      })
    }
  }
}
</script>

<style>

</style>
