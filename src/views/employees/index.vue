<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <!-- <span slot="before">共16条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>

      </page-tools>
      <!-- 放置表格和分页 -->
      <el-table v-loading="loading" :data="list" border="">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column width="120px" label="头像" align="center">
          <!-- 插槽 -->
          <template v-slot="{ row }">
            <img
              v-imageerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              alt=""
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <!-- 格式化聘用形式 -->
        <el-table-column label="聘用形式" sortable :formatter="formatEmployment" prop="formOfEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <!-- 作用域插槽 + 过滤器 -->
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template v-slot="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template v-slot="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符 是子组件去修改父组件数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- dom为一个canvas的dom对象, info为转化二维码的信息 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role'
import QrCode from 'qrcode'
export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false, // 显示分配角色弹层
      userId: null // 定义一个userId
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage是最新的页码
    changePage(newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        // 导出 header从哪里来
        // data从哪里来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每条数据 100 1 10000
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 复杂表头的导出
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 合并表头
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
        // [{ username: '张三:', mobile:13112345678 }] => [[]]
        // 要转化 数据结构还要和表头顺序对应上
        // 要求转化的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [{}]  [[]]
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象 { mobile: 132111, username:'张三'}
        // ['手机号', '姓名', '入职日期']
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // 简化成一行代码
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    showQrCode(url) {
      // url存在的情况, 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了, 但是页面的渲染是异步的
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化为二维码
          // 如果转化的二维码后面信息是一个地址 ,就会跳转到该地址
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      // 显示弹层
      this.userId = id // props赋值 props赋值渲染是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 调用子组件方法
      this.showRoleDialog = true
    }
  }

}
</script>

<style>
</style>
