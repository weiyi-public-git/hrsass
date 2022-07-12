<template>
  <div>  <!-- 给action一个#号 就不会报错了 -->
    <!-- file-list是上传的文件列表 可以绑定到上传组件上, 让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      action="#"
      :class="{ disabled : fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px" />
    <!-- 放置一个弹层 -->
    <!-- sync修饰符就自动将弹层关闭了 -->
    <el-dialog :visible.sync="showDialog" title="图片">
      <img :src="imgUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDjMo7EAuSsFVq7GLRccQ5YqxufDajdIm5', // 身份识别 ID
  SecretKey: 'r482h8MNAj8NRdbLtEKEyYvc7R4VjlaL' // 身份密钥
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      fileList: [],
      showDialog: false, // 控制图片的显示或隐藏
      imgUrl: '', // 存储点击的图片地址
      currentFileUid: null, // 用一个变量 记录当前正在上传的uid
      percent: 0, // 记录当前的百分比
      showPercent: false
    }
  },
  computed: {
    // 判断是否已经上传完了一张 设定一个计算属性
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      // 这里应该弹出层 里面是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是点击删除的文件
    // fileList是删除过后的文件
    // 文件列表移除文件之前的钩子
    handleRemove(file) {
      // 将原来的文件给排除掉了,剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
    },
    // 不能用push 这个钩子会执行多次
    // 文件状态改变时的钩子 添加文件,上传成功或上传失败都会调用
    changeFile(file, fileList) {
      // file是当前的文件 fileList是当前的最新数组 this.fileList
      this.fileList = fileList.map(item => item)
    },
    // 上传文件之前的钩子 参数为上传的问价 若返回false或者返回Promise且被reject,则停止上传
    beforeUpload(file) {
      // 开始做文件上传的检查
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小 1M = 1024KB 1KB = 1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        //   超过了限制的文件大小
        this.$message.error('上传的文件图片大小不能超过5M')
        return false
      }
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true // 可以继续上传
    },
    upload(params) {
      // 自定义上传动作 有个参数 有个file对象,是我们需要上传到腾讯云服务器的内容
      if (params.file) {
        // 上传文件到腾讯云
        cos.putObject({
          Bucket: 'xiaoxu-1314-1312634560', // 存储桶的名称
          Region: 'ap-beijing', // 存储桶所在地域
          Key: params.file.name, // 对象键 对象在存储桶中的唯一标识
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // data中有一个statusCode === 200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功 要获取成功的返回地址
            // 目前虽然是一张图片 但是filelist 是一个数组
            // 需要知道当前上传成功是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为后期应用的时候做标记
              }
              return item
            })
            // 将腾讯云地址写入到fileList上,保存的时候就可以从fileList中直接获取图片地址
            // 关闭进度条
            // 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>
