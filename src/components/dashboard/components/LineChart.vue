<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// import { debounce } from '@/utils'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
		//不同类型的曲线图
    chartData: {
      type: Object,
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart()
		//自适应不同浏览器大小（自动缩放）
    if (this.autoResize) {
      /* this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100) */
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    /* const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder) */
		
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }
		
		// 监听侧边栏的变化
		/*const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder) */

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
			//父组件向子组件传值
      handler(val) {
        this.setOptions(val)
      }
    },
  },
  methods: {
		
    setOptions({month, projectComplete, projectDeclare } = {}) {
			var monthArr = [];
			if(month){
				for(var i= 0;i<month.length;i++){
					monthArr.push(month[i]);
				}
			}
      this.chart.setOption({
				//图表标题
				title: {
         text: ''
        },
				//X轴 
        xAxis: [
					{
						data:monthArr,
						boundaryGap: false,
						axisTick: {
							show: false
						}
					},
				],
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
				//坐标轴触发的提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        //Y轴
				yAxis: {
          axisTick: {
            show: false//去掉坐标轴刻度线
          }
        },
				//图表上方的类别显示
        legend: {
          data: ['项目申报', '项目结项']
        },
        // 系列内容列表
				series: [
					{
						name: '项目申报', itemStyle: {
							normal: {
								color: '#FF005A',
								lineStyle: {
									color: '#FF005A',
									width: 2
								}
							}
						},
						smooth: true,
						type: 'line',
						data: projectDeclare,
						animationDuration: 2800,
						animationEasing: 'cubicInOut'
					},
					{
						name: '项目结项',
						smooth: true,
						type: 'line',
						itemStyle: {
							normal: {
								color: '#3888fa',
								lineStyle: {
									color: '#3888fa',
									width: 2
								},
								areaStyle: {
									color: '#f3f8ff'
								}
							}
						},
						data: projectComplete,
						animationDuration: 2800,
						animationEasing: 'quadraticOut'
					},
				]
      })
    },
		
		/* 
		 初始化echarts
		 */
    initChart() {
			// echarts theme
      this.chart = echarts.init(this.$el, 'macarons')
			//初始化
      this.setOptions(this.chartData)
    }
		
  }
}
</script>
