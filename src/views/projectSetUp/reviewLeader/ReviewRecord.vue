<!--
	录入会议材料
 -->
<template>
  <div>
  	<h2 class="page-title">领导评审</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">网信办意见</h4>
  		<div class="block-body">
  			<div class="body-content body-contents">

					<h4 class="block-depart-title expert-opinion">上会材料</h4>
					<div class="clear"></div>
					<!-- 会议材料 -->
					<el-upload
						class="upload-demo"
						ref="uploadFlie"
						:action="`${common.basePath}/file/-1/uplode`"
						:headers="myHeaders"
						:auto-upload="true"
						multiple
						:limit="99"
						:on-success="uploadSuccessFile"
						:on-error="uploadErrorFile">
						<el-button slot="trigger" size="small" type="primary">上传会议材料</el-button>
						<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">允许上传多个文件</span>
				 	</el-upload>

  			</div>
  		</div>
  		<div class="block-bottom" >
				<el-button type="primary" @click="next" size="small" class="center">下一步</el-button>
  		</div>
  	</div>
  </div>
</template>

<script>
  export default {
		data(){
			return{
				file:[],
				id:-1,
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				rowData:sessionStorage.getItem("rowLeaderInfo"),
				rowDataArr:[],
			}
		},
		methods: {

			/*
				上传文件url
			 */
			UploadUrl(){
					return this.common.basePath+"/file/"+ JSON.parse(sessionStorage.getItem("rowLeaderInfo")).processVariables.projectId +"/uplode";
			},

			/*
				上传文件 ---文件上传成功时
			*/
			uploadSuccessFile(err, file, fileList) {
				let files = fileList.map((item, index) => {
					return {
						name:item.response.data.name,
						url: item.response.data.path
					}
				})
				this.file = files
			},

			/*
				上传文件 ---文件上传失败时
			*/
			uploadErrorFile(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.file = []
			},

			/*
				下一步
			 */
			next(){
				this.metting();
			},

			metting(){
				var formData = {
					tips:"已准备好开会材料",
					curStatus:8,
					metingFile:this.file,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee
				}
				if(this.file==""){
					this.$message.error("您还未上传会议材料！！！", 20);
					return;
				}
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/leader/approval'});
					}else{
						this.$message.error(response.data.meta.message, 20);
					}
				}).catch( (error) => {
					this.$message.error(error,20);
				});
			},

		},
		mounted() {
			var that = this;
			var rowDataArr = [];
			rowDataArr.push(JSON.parse(this.rowData))
			that.rowDataArr = rowDataArr
		},
  }
</script>

<style>
	.center{
		margin: 0 auto !important;
		text-align: center !important;
	}
</style>
