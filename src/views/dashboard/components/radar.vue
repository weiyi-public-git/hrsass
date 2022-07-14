<template>
  <!-- 雷达图 必须给高和宽度 -->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// var echarts = require('echarts')
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      tooltip: {},
      radar: {
        // shape: 'circle',
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '张三 vs 李四',
          type: 'radar',
          data: [
            {
              value: [42, 30, 20, 35, 50, 18],
              name: '张三指标'
            },
            {
              value: [50, 14, 28, 26, 42, 21],
              name: '李四指标'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
