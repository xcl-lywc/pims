<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import { debounce } from '@/utils'
const animationDuration = 3000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    /* this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100) */
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '教育', max: 10000 },
            { name: '公共服务', max: 20000 },
            { name: '卫生', max: 20000 },
            { name: '政务', max: 20000 },
            { name: '环卫', max: 20000 },
            { name: '劳保', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['国家专项资金', '市财政资金', '区财政资金','其他资金']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: '国家专项资金'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '市财政资金'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '区财政资金'
            }
            ,
            {
              value: [5600, 100, 22000, 15500, 16200, 8000],
              name: '其他资金'
            }
          ],
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
