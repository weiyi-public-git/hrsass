<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width:20px; height:20px ;"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      document.documentElement.requestFullscreen()
      if (!ScreenFull.isEnabled) {
        this.$message.warning('当前全屏')
        return
      }
      // 直接全屏
      ScreenFull.toggle() // 全屏方法
    }
  }
}
</script>

<style>

</style>
