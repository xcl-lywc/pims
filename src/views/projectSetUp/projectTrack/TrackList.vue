 <!--
		项目历史跟踪图
	-->
<template>
  <div> 
    <el-button class="back-button" type="primary" icon="el-icon-back" size="middle"  @click=" $router.go(-1) ">返回</el-button>
    <div class="block-wrap">
      <h4 class="block-title"> 
        进度汇报 
      </h4>
      <div class="block-body"> 
        <div class="body-content">
          <progress-report :projectId="projectId"></progress-report>
        </div>
      </div>
    </div> 
  </div> 
</template>

<script>
	import  progressReport from '../projectDeclare/ProgressReport.vue';
  export default {
  	components: {
  		'progress-report': progressReport,
  	},
    methods: {
      /* 
				流程历史
      */
      processHistory(){
      	var formData = {
      		instanceId:JSON.parse(sessionStorage.getItem("historyId")),
      	}
      	this.axios.post(`${this.common.basePath}/activiti/history`,formData).then( (response) => {
      		if(response.data.meta.code === 0){
      			// this.$message.success(response.data.meta.message, 20);
						this.history = response.data.data.reverse();
      		}else{
      			this.$message.error(response.data.meta.message, 20);   
      		}
      	}).catch( (error) => {
      		this.$message.error(error,20);            
      	});
      },
    },
		mounted(){ 
		},
    data() {
      return { 
      	loading: false,
      	//详情
				projectId: this.$route.params.id,
      }
    }
  }
</script>

<style>

	/* 
	 项目跟踪图的样式
	 */
		ul,li{
			padding: 0;
			margin: 0;
		}
		
		ul,li{
			list-style: none;
		}
		
		.b-c-s{
			border-left-color: #1d1f26 !important;
		}
		
		.b-c-s:before{
			border-color: #1d1f26 !important;
		}
		
		.b-c-s:hover:before{
			background: #1d1f26 !important;
		}
		
		.clear{
			clear: both;
		}
		
		.wrapper{
			overflow: hidden;
		}
		
		.time-line{
			margin-bottom: 50px;
			margin-top: 20px;
		}
		
		.time-line .tl-item{
			overflow: hidden;
		}
		
		.time-line .tl-title{
			margin-left: 335px;
		}
		
		.time-line .tl-item .tl-item-right{
			border-left-width: 3px;
			border-left-color: #23b7e5;
			border-left-style: solid;
			box-sizing: border-box;
			padding:20px;
		}
		
		.time-line .tl-item .tl-item-right:before{
			position: relative;
			top: 14px;
			float: left;
			width: 8px;
			height: 8px;
			margin-left: -27px;
			background: #edf1f2;
			border-color: #23b7e5;
			border-style: solid;
			border-width: 2px;
			border-radius: 50%;
			content: "";
			box-shadow: 0 0 0 4px #f0f3f4;
		}
		
		.time-line .tl-item .tl-item-right:hover:before{
			background: #23b7e5;
			border-color: #edf1f2;
		}
		
		.time-line .tl-item .tl-item-right .content{
			border: 1px solid #edf1f2;
			height: 20px;
	    padding: 10px 20px 10px 10px;
			background-color: #fff;
			color: #222;
			font-size: 15px;
		}
		
		.time-line .tl-item .tl-item-right .content .arrow-left{
			display: inline-block;
	    width: 10px;
	    height: 10px;
	    border: 1px solid #edf1f2;
	    background-color: #fff;
	    border-right-color: transparent;
	    border-bottom-color: transparent;
	    -webkit-transform: rotate(-45deg);
	    transform: rotate(-45deg);
	    position: relative;
	    left: -16px;
	    top: -2px;
		}
		
		.time-line .tl-item .tl-item-left{
			width: 360px;
			text-align: right;
			overflow: hidden;
			box-sizing: border-box;
			padding:30px 20px 20px 20px;
			font-size: 14px;
			color: #333;
		}
	
</style>