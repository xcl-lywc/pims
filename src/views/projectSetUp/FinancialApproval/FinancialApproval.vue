<!-- 
	财务审批 
 -->
<template>
  <div>
  	<h2 class="page-title">财政意见</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">财政意见</h4>
  		<div class="block-body">
  			<div class="body-content">
					
					<h4 class="block-depart-title">录入财政评审相关意见</h4>
					<el-form :model="ruleForm" ref="ruleForm" label-width="200px" size="small" enctype="multipart/form-data">
						<!-- <el-form-item label="项目方案简报:" class="is-required" prop="file99">
							<el-upload
								class="upload-demo"
								ref="uploadFlie99"
								:file-list = 'ruleForm.file99'
								:before-remove="beforeRemove99"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFile99"
								:on-error="uploadErrorFile99">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
							</el-upload>
						</el-form-item> -->
						<el-form-item label="财政专家评审意见：" class="is-required" prop="file5">
						<el-upload
							class="upload-demo"
								ref="uploadFlie5"
								:file-list = 'ruleForm.file5'
								:before-upload="beforeUpload5"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="99"
								:on-success="uploadSuccessFile5"
								:on-error="uploadErrorFile5">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip"> 若有二次评审请都要上传(.jpg .png .pdf格式)</span>
								</el-upload>
							</el-form-item>
						<el-form-item label="项目建设方案(终审稿)：" class="is-required" prop="file2">
							<el-upload
								class="upload-demo"
								ref="uploadFlie2"
								:file-list = 'ruleForm.file2'
								:before-remove="beforeRemove2"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFile2"
								:on-error="uploadErrorFile2">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
							</el-upload>
						</el-form-item>
					</el-form>
					
					<h4 class="block-depart-title">财政意见-调整预算金额</h4>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm base-info" size="middle">
						<el-form-item label="财政意见-调整预算金额：" prop="budgetFinance">
							<el-input v-model="ruleForm.budgetFinance" placeholder="请输入预算金额">
								<template slot="append">万元</template>
							</el-input>
						</el-form-item>
					</el-form>
  			</div>
  		</div>
  		<div class="block-bottom">
				<div class="btn-t4">
					<el-button type="primary" @click="yes" size="small">提交材料</el-button>
					<!-- <el-button @click="no" size="small">驳回</el-button> -->
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
				detailData:null,
				projectId:this.$route.params.id,
				rowData:sessionStorage.getItem("rowFinancialInfo"),
				rowDataArr:[],
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				ruleForm: {
					file2:[],
					file5:[],
					// file99:[],
					budgetFinance:null,
				},
				rules:{
					budgetFinance:[
						{ required: true, message: '请输入预算金额', trigger: 'blur' },
					],
				},
			}
		},
		methods: {
			
			/*
			* 获取详情
			*/
			getDetail(){
				this.axios.get(`${this.common.basePath}/project/detail/${this.projectId}`,this._detailParams()).then( (response) => {
						// this.detailData = response.data.data;
						this.ruleForm.file2 = response.data.data.financePlan==null?[]:JSON.parse(response.data.data.financePlan);
						
						this.ruleForm.file5 = response.data.data.financeDudget==null?[]:JSON.parse(response.data.data.financeDudget);
						// this.ruleForm.file99 = response.data.data.projectBriefing== null?[]:JSON.parse(response.data.data.projectBriefing);
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			_detailParams(){
				return {
					params: {
						id:this.projectId,
					}
				}
			},
			
			/* 
				通过、驳回、
			*/
			yes(){
				this.$confirm('是否确认提交材料？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.adopt();
				}).catch(() => {        
				});
			},
			no(){
				this.$prompt('请输入驳回原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					this.reject(value);
				}).catch(() => {    
				});
			},
			
			/* 
				上传文件url
			*/
			UploadUrl(){
					return this.common.basePath+"/file/"+ JSON.parse(sessionStorage.getItem("rowFinancialInfo")).processVariables.projectId +"/uplode";      
			},

			/* 
				上传文件 ---文件上传成功时
			*/
			uploadSuccessFile2(res) {
				this.ruleForm.file2 = [{name:res.data.name,url:res.data.path}];
			},
			uploadSuccessFile5(res, file, fileList) {
				// this.ruleForm.file5.push({name:res.data.name,url:res.data.path});
				this.ruleForm.file5 = fileList
			},
			uploadSuccessFile99(res) {
				this.ruleForm.file99 = [{name:res.data.name,url:res.data.path}];
			},
			/* 
				上传文件 ---文件上传失败时
			*/
			uploadErrorFile2(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file2 = []
			},
			uploadErrorFile5(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file5 = []
			},
			uploadErrorFile99(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file99 = []
			},
			/* 
			文件上传---删除文件
			*/
			beforeRemove2(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.ruleForm.file2 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.ruleForm.file2 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			beforeUpload5(file, fileList) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isPDF = file.type === 'application/pdf';

        if (!isJPG&&!isPNG&&!isPDF) {
          this.$message.error('上传文件只能是 JPG/PNG/PDF 格式!');
        }
        return isJPG || isPNG || isPDF;
				// return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: ''
				// }).then(() => {
				// 	this.ruleForm.file5 = fileList;
				// 	this.$message({
				// 		type: 'success',
				// 		message: '删除成功!'
				// 	});
				// }).catch(() => {
				// 	var fileArr = [];
				// 	fileArr.push(file)
				// 	this.ruleForm.file5 = fileArr;
				// 	this.$message({
				// 		type: 'info',
				// 		message: '已取消删除'
				// 	});          
				// });
			},
			beforeRemove99(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.ruleForm.file99 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.ruleForm.file99 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			/* 
			通过
			*/
			adopt(){
				if(this.ruleForm.file5 == ''){
					this.$message.error('上传的 财务出具的评审报告 缺失!!!', 60);
					return;
				}
				if(this.ruleForm.file2 == ''){
					this.$message.error('上传的 项目建设方案(终审稿) 缺失!!!', 60);
					return;
				}
				if(this.ruleForm.budgetFinance==null){
					this.$message.error("您还未输入调整预算金额！！！", 20);   
					return;
				}
				// if(this.ruleForm.file99 == ''){
				// 	this.$message.error('上传的 项目方案简报 缺失!!!', 60);
				// 	return;
				// }
				var formData = {
					read_status:1,
					curStatus:11,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee,
					file2:this.ruleForm.file2,
					file5:this.ruleForm.file5,
					// file99:this.ruleForm.file99
					budgetFinance:this.ruleForm.budgetFinance,
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.opinionFileDialogVisible = false;
						this.$router.push({path: '/project_set_up/financial'});
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
					read_status:0,
					curStatus:11,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee,
					rejectReason:value
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/financial'});
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
			
			this.getDetail();
		},
  }
</script>

<style> 

</style>