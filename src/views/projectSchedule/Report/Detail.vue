<!-- 
	项目进度汇报详情
 -->
<template>
  <div>
  	<h2 class="page-title">项目进度</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">项目进度汇报详情</h4>
  		<div class="block-body">
  			<div class="body-operation">
  				<el-row :gutter="20">
  					<el-col :span="12">
  							<!-- <el-button type="" icon="fa fa-upload" size="small"> 导 出</el-button> -->
  					</el-col>
  					<el-col :span="12" :offset="0">
  							
  					</el-col>
  				</el-row>
  			</div>
  			<div class="body-content">
  				<ul class="content">
  				
						<h4 class="block-depart-title">基本信息</h4>
						<li><span class="item fl">项目名称：</span><span class="fl">{{detail.name}}</span></li>
						<li><span class="item fl">创建日期：</span><span class="fl">{{detail.createTime | formatDate}}</span></li>
						<li><span class="item fl">负责人：</span><span class="fl">{{detail.orgName}}</span></li>
						<li><span class="item fl">项目集资：</span><span class="fl">{{detail.payMoney}}</span><span class="fl">/万元</span></li>
						<li><span class="item fl">总进度：</span><span class="fl">{{detail.schedule*100+"%"}}</span></li>
						
						<h4 class="block-depart-title">节点展示</h4>
						<ul v-for="(item,index) in detail.checkPoint" class="point-box">
							<p>{{"节点 "+(index+1)}}</p>
							<li><span class="item fl">时间段：</span><span class="fl">{{item.beginTime | formatDate}}</span><span class="fl"> 至 </span><span class="fl">{{item.endTime | formatDate}}</span></li>
							<li><span class="item fl">创建日期：</span><span class="fl">{{item.createTime | formatDate}}</span></li>
							<li><span class="item fl">创建者：</span><span class="fl">{{item.creator}}</span></li>
							<li><span class="item fl">项目集资：</span><span class="fl">{{item.payMoney}}</span><span class="fl"> /万元</span></li>
							<li class="schedule-h"><span class="fl item">项目进度：</span><el-progress :percentage="item.schedule*100" :stroke-width="5" type="circle" class="fl"></el-progress></li>
							<li><span class="item fl">项目附件：</span><a :href="JSON.parse(item.attachment).path" class="fl"  target="view_window">{{JSON.parse(item.attachment).name}}</a></li>
						</ul>
						
  				
  				</ul>
  			</div>
  		</div>
  	</div>
  </div>
</template>

<script>
	import {formatDate} from '../../../plugins/data.js';
  export default {
		data(){
			return{
				id:sessionStorage.getItem("addCheckPointId"),
				detail:{},
			}
		},
		/* 
			转化时间戳
		*/
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd');
			}
		},
		methods: {
			
			/*
			* 获取详情
			*/
			getDetail(){
				this.axios.get(`${this.common.basePath}/checkpoint/point/${this.id}`,this._detailParams()).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.detail = response.data.data;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			_detailParams(){
				return {
					params: {
						projectId:sessionStorage.getItem("addCheckPointId"),
					}
				}
			},
			
		},
		mounted() {
			/* 
				展示详情 
			 */
			this.getDetail()
		},
  }
</script>

<style>

</style>