<!-- 
	领导会议审批
 -->
<template>
  <div>
  	<h2 class="page-title">网信会议</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">网信会议</h4>
  		<div class="block-body">
  			<div class="body-content body-contents">
  				
  				<h4 class="block-depart-title expert-opinion">审批结果</h4>
  				<div class="clear"></div>
  				<el-input type="textarea" v-model="desc"></el-input>
					
					
					<h4 class="block-depart-title expert-opinion">网信会议-调整预算金额</h4>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm base-info" size="middle">
						<el-form-item label="网信会议-调整预算金额："  prop="budgetApproval">
							<el-input v-model="ruleForm.budgetApproval" placeholder="请输入预算金额">
								<template slot="append">万元</template>
							</el-input>
						</el-form-item>
					</el-form>
					
					<h4 class="block-depart-title expert-opinion">附件上传</h4>
  				<el-upload
						class="upload-demo mart10"
						ref="uploadFlie"
						:action="`${common.basePath}/file/-1/uplode`"
						:headers="myHeaders"
						:auto-upload="true"
						multiple
						:limit="99"
						:on-success="uploadSuccessFile"
						:on-error="uploadErrorFile">
						<el-button slot="trigger" size="small" type="primary">上传附件</el-button>
						<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">允许上传多个文件</span>
				 	</el-upload>
  			</div>
  		</div>
  		<div class="block-bottom" v-if="rotation">
				<div class="btn-t4">
					<el-button type="primary" @click="yes" size="small">通过</el-button>
					<!-- <el-button @click="no" size="small"  v-if="rotation<2">返回修改</el-button> -->
					<el-button @click="stop" size="small">关闭</el-button>
				</div>
  		</div>
  	</div>
  </div>
</template>

<script>
  export default {
		data(){
			return{
				desc:'',
				file: [],
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				rowData: sessionStorage.getItem("rowLeaderInfo"),
				rowDataArr:[],
				rotation:JSON.parse(sessionStorage.getItem("rowLeaderInfo")).processVariables.leaderRotation,
				ruleForm:{
					budgetApproval:null,
				},
				rules:{
					budgetApproval:[
						{ required: true, message: '请输入预算金额', trigger: 'blur' },
					],
				},
				id:JSON.parse(sessionStorage.getItem("rowLeaderInfo")).processVariables.projectId,
			}
		},
		methods: {
			
			/* 
				通过、驳回、关闭
			*/
			yes(){
				this.$confirm('是否通过该项目？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.adopt();
				}).catch(() => {        
				});
			},
			no(){
				this.$prompt('请输入修改原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.reject(value);
				}).catch(() => {
				});
			},
			stop(){
				this.$prompt('请输关闭原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.void_(value);
				}).catch(() => {   
				});
			},
			
			/* 
			通过
			*/
			adopt(){
				var formData = {
					read_status:1,
					curStatus:9,
					leaderOpinion:this.desc,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee,
					meetingAttachment: this.file, // 附件
					budgetApproval:this.ruleForm.budgetApproval,
				}
				if(this.desc==""){
					this.$message.error("您还未填写审批结果！！！", 20);   
					return;
				}
				if(this.ruleForm.budgetApproval==null){
					this.$message.error("您还未输入调整预算金额！！！", 20);   
					return;
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/leader'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			
			/* 
				驳回
			*/
			reject(value){
				var formData = {
					read_status:2,
					curStatus:9,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee,
					rejectReason:value
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/leader'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			
			/* 
				关闭
			*/ 
			void_(value){
				var formData = {
					instanceId:JSON.parse(sessionStorage.getItem("rowLeaderInfo")).processVariables.instanceId,
					rejectReason:value,
				}
				this.axios.post(`${this.common.basePath}/activiti/instance/delete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.error('该项目已关闭！！', 20);
						this.$router.push({path: '/project_set_up/leader'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			/* 
				上传文件url
			 */
			UploadUrl(){
				debugger
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
	
</style>