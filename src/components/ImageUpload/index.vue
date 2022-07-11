<template>
  <div>  <!-- 给action一个#号 就不会报错了 -->
    <!-- file-list是上传的文件列表 可以绑定到上传组件上, 让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :class="{ disabled : fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{ url: 'http://5b0988e595225.cdn.sohucs.com/images/20190412/cd142e32052447d1b24e74f23cfc9a1b.jpeg' }],
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    // 如果它为 true 表示就不应该显示 +号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是点击删除的文件
    // fileList是删除过后的文件
    // 文件列表移除文件之前的钩子
    handleRemove(file, fileList) {
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
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
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
      return true // 可以继续上传
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>
