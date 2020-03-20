<template>
  <div class="dashboard-editor-container">
		<!-- 
			小模块
		 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

		<!-- 
			曲线图
		 -->
    <el-row style="background:rgba(255, 255, 255, 0.7);padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

		<!-- 
			扇形图、饼状图、柱状图
		 -->
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

  </div>
</template>


<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

/* const lineChartData = {
  newVisitis: {
    projectDeclare: [100, 120, 161, 134, 105, 160, 165],
    projectComplete: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    projectDeclare: [200, 192, 120, 144, 160, 130, 140],
    projectComplete: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    projectDeclare: [80, 100, 121, 104, 105, 90, 100],
    projectComplete: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    projectDeclare: [130, 140, 141, 142, 145, 150, 160],
    projectComplete: [120, 82, 91, 154, 162, 140, 130]
  }
} */

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: {},
    }
  },
  methods: {
		
		/* 
		 点击不同模块展示不同的曲线图
		 */
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
		
		/*
		* 曲线图的相关数据
		*/
		getLineData(){
			this.axios.get(`${this.common.basePath}/project/curve`,this._lineParams()).then( (response) => {
				if(response.data.meta.code === 0){
					// this.$message.success(response.data.meta.message, 20);
					// this.lineChartData = response.data.data;
					var projectCompleteArr = response.data.data.projectComplete;
					var projectDeclareArr = response.data.data.projectDeclare;
					// 项目结项--y值
					var yCompleteArr = [];
					for(var i = 0;i<projectCompleteArr.length;i++){
						yCompleteArr.push(projectCompleteArr[i].count)
					}
					// 项目结项--x值
					var xCompleteArr = [];
					for(var i = 0;i<projectCompleteArr.length;i++){
						xCompleteArr.push(projectCompleteArr[i].month+"月份")
					}
					// 项目申报--y值
					var yDeclareArr = [];
					for(var i = 0;i<projectDeclareArr.length;i++){
						yDeclareArr.push(projectDeclareArr[i].count)
					}
					// 项目申报--x值
					var xDeclareArr = [];
					for(var i = 0;i<projectDeclareArr.length;i++){
						xDeclareArr.push(projectDeclareArr[i].month+"月份")
					}
					//y值和x值
					var lineChartDataObj = {};
					lineChartDataObj.projectDeclare = yDeclareArr;
					lineChartDataObj.projectComplete = yCompleteArr;
					lineChartDataObj.month = xDeclareArr;
					this.lineChartData = lineChartDataObj;
					
				}else{
					this.$message.error(response.data.meta.message, 20);   
				}
			}).catch( (error) => {
				this.$message.error(error);
			});
		},
		_lineParams(){
			return {
				params: {}
			}
		},
		
  },
	mounted(){
		this.getLineData();
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.dashboard-editor-container {
		padding: 32px;
		background-color: rgb(240, 242, 245);
		// background-color: rgb(255, 255, 255);
		// background: url(../../assets/img/bg-img/flower.jpg);
		background-size: 100% 100%;
		.chart-wrapper {
			background: #fff;
			padding: 16px 16px 0;
			margin-bottom: 32px;
		}
	}
</style>
