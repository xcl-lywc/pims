<!-- 
	综合专家意见
 -->
<template>
  <div>
  	<h2 class="page-title">专家评审</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">综合专家意见</h4>
  		<div class="block-body">
  			<div class="body-content body-contents">
  				<h4 class="block-depart-title">正审专家</h4>
  				<div class="clear"></div>
  				<div>
  					<el-tag
  						v-for="(item,index) in member"
  						:key="item.assExpert">
  						<span @click="clickExpert(item.assExpert,item.assExpertName,item.childrens,index)">{{item.assExpertName}}</span>
  					</el-tag>
  				</div>
  				<div class="opinion-input" v-for="(item,index) in member" v-show="memberindex==index">
						<span class="expert">{{'专家：'+item.assExpertName}}</span>
  					<el-upload
  						ref="commentUpload"
  						class="upload-demo"
  						:before-upload="beforeUpload"
  						:action="`${common.basePath}/file/-1/uplode`"
  						:headers="myHeaders"
  						:on-success="((res)=>{handleRemoveComment(res, item, 'commentUpload')})" 
  						:show-file-list="false"
  						multiple
  						:limit="100">
  						<div v-if="member_" v-for="(val,index) in member_" v-show="memberindex==index">
  							<ul class="opinion-img_">
  								<li v-for="(img,index) in val.childrens" @click="clickPic(img.id)">
  									<hr/>
  									<p v-if="img.comment!=null">{{'第'+(index+1)+'轮意见：'}}</p>
  									<img v-if="img.comment" :src="'/pics'+JSON.parse(img.comment).path" class="avatar"/>
  									<p v-if="img.comment==null&&(rotation==2||rotation==3)&&index==0" >
  										<span @click.stop="$message.error('该阶段，您不能上传第一轮的意见！！', 20);">第1轮您未上传意见</span>
  									</p>
  									<div v-if="img.comment==null&&rotation==1" style="position: relative;">
  										<div class="" slot="trigger">
												<i class="el-icon-plus avatar-uploader-icon"></i>
												<span slot="" class="el-upload__tip" style="position: absolute;top: 75%;left: 15%;width: 70%;">请上传图片格式的文件</span>
											</div>
  									</div>
  									<div v-if="img.comment==null&&(rotation==2||rotation==3)&&index==1" style="position: relative;">
											<p v-if="img.comment!=null">请上传第2轮意见</p>
											<img v-if="img.comment" :src="'/pics'+JSON.parse(img.comment).path" class="avatar"/>
											<p v-if="img.comment==null&&(rotation==3)&&index==1" >
												<span @click.stop="$message.error('该阶段，您不能上传第二轮的意见！！', 20);">第2轮您未上传意见</span>
											</p>
											<div class="" slot="trigger" v-if="rotation==2">
												<i class="el-icon-plus avatar-uploader-icon"></i>
												<span slot="" class="el-upload__tip" style="position: absolute;top: 75%;left: 15%;width: 70%;">请上传图片格式的文件</span>
											</div>
  									</div>
  								</li>
  							</ul>
  						</div>
  					</el-upload>
  				</div>
					<div class="tips-s">点击图片可重新上传。</div>
  			</div>
  		</div>
  		<div class="block-bottom" v-if="rotation">
				<div class="btn-t6">
					<el-button type="primary" @click="yes" size="small">通过</el-button>
					<el-button @click="no" size="small" v-if="rotation<3">返回修改</el-button>
					<el-button @click="stop" size="small">关闭</el-button>
				</div>
  		</div>
  	</div>
		<!-- 返回修改弹框 -->
		<el-dialog
			title="提示"
			:visible.sync="noDialogVisible"
			width="40%">
			<el-form label-width="80px">
				<el-form-item label="修改原因:">
					<el-input type="textarea" v-model="value" placeholder="请输入修改原因"></el-input>
				</el-form-item>
				<el-form-item label="修改后是否再次邮件通知正审专家？" label-width="300px" class="is-required">
					<el-radio-group v-model="radio">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="noDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="reject">确 定</el-button>
			</span>
		</el-dialog>
  </div>
</template>

<style scoped>
	.avatar-uploader-icon{
		font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
		border: 1px solid #ddd;
	}
	.opinion-input .expert{
		font-size: 18px;
		color: #333333;
		font-weight: 600;
	}
	.opinion-img_{
		overflow: hidden;
		margin: 10px auto 10px;
	}
	.opinion-img_ li{
		overflow: hidden;
	}
	.opinion-img_ li p{
		text-align: left;
    padding: 10px 5px;
    font-size: 15px;
    font-weight: 600;
    color: #666;
	}
	.opinion-img_ li img{
		width: 90%;
	}
	.tips-s{
		margin: 5px 0 0 2%;
		color: #333;
	}
</style>

<script>
  export default {
		data(){
			return{
				radio:'',
				value:'',
				noDialogVisible:false,
				id:'',
				index:0,
				// rotation:this.$route.params.rotation,
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				rowData:sessionStorage.getItem("rowReviewInfo"),
				rowDataArr:[],
				memberindex:'',
				member: '',
				member_:'',
				placeholder:'请输入专家意见',
				formalExpertOpinion:'',
				activiteId:JSON.parse(sessionStorage.getItem("rowReviewInfo")).processVariables.instanceId,
				projectId:JSON.parse(sessionStorage.getItem("rowReviewInfo")).processVariables.projectId,
				rotation:JSON.parse(sessionStorage.getItem("rowReviewInfo")).processVariables.expertRotation,
			}
		},
		methods: {
			clickPic(id){
				console.log(id)
				this.id = id;
			},
			clickPlus(id){
				console.log(id)
				this.id = id;
			},
			/* 
				驳回、关闭、通过
			*/
		 yes(){
		 	this.$confirm('是否通过该项目？', '提示', {
		 		confirmButtonText: '确定',
		 		cancelButtonText: '取消',
		 		type: 'warning'
		 	}).then(() => {
		 		this.adopt();
		 	}).catch(() => {
		 		this.$message({
		 			type: 'info',
		 			message: '您已取消通过该项目'
		 		});          
		 	});
		 },
			no(){
				this.noDialogVisible = true;
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
			上传意见附件
			*/
			handleRemoveComment(res, item, uploadName){
				if(res.meta.code == 0) {
					this.publishOpinion_(res.data, item);
					item.comment = JSON.stringify(res.data);
					// this.$refs[uploadName][0].clearFiles();
				}
			},
			/* 
				上传文件 ---限制用户上传的图片格式
			*/
			beforeUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';

				if (!isJPG&&!isPNG) {
					this.$message.error('上传文件只能是 JPG/PNG 格式!');
				}
				return isJPG || isPNG;
			},
			/* 
				发表意见
			*/
			publishOpinion_(files, item){
				var formData = {
					comment: JSON.stringify(files),
					// id:item.expertId,
					id:this.id,
				}
				this.axios.post(`${this.common.basePath}/assessment_expert/expert/opinion`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("发表"+response.data.meta.message, 20);
						this.getFormalExpertArr();
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			
			/* 
			点击专家输入专家意见
			*/
			clickExpert(id,name,comment,index){
				this.memberindex = index;
			},
			
			/* 
			通过
			*/
			adopt(){
				var formData = {
					read_status:1,
					curStatus:7,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success('请等待申报单位上传项目方案（简版）后提交...', 20);
						this.modifyDialogVisible=false;
						this.$router.push({path: '/project_set_up/review'});
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
				if(this.radio == ''){
					this.$message.error("请选择是否发送邮件。", 20); 
					return;
				}
				var formData = {
					isEmailB:Number(this.radio),
					read_status:2,
					curStatus:7,
					instanceId:this.rowDataArr[0].processVariables.instanceId,
					assignee:this.rowDataArr[0].processVariables.assignee,
					rejectReason:this.value,
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success('请等待申报单位上传正审改进方案后提交...', 20);
						this.noDialogVisible = false;
						this.$router.push({path: '/project_set_up/review'});
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
					instanceId:JSON.parse(sessionStorage.getItem("rowReviewInfo")).processVariables.instanceId,
					rejectReason:value,
				}
				this.axios.post(`${this.common.basePath}/activiti/instance/delete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.error('该项目已关闭！！', 20);
						this.$router.push({path: '/project_set_up/review'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			
			/*
			* 获取正审专家组
			*/
			getFormalExpertArr(){
				this.axios.get(`${this.common.basePath}/assessment_expert/all/${this.projectId}`,this._pretrialExpertParams()).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.member = response.data.data;
						this.member_ = response.data.data;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
					
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			_pretrialExpertParams(){
				return {
					params: {
						type: 2,
					}
				}
			},
			
		},
		mounted() {
			var that = this;
			var rowDataArr = [];
			rowDataArr.push(JSON.parse(this.rowData))
			that.rowDataArr = rowDataArr
			
			/*
			* 获取正审专家组
			*/
			this.getFormalExpertArr();
		},
  }
</script>

<style>
	/* 专家意见框 */
	.opinion-input{
		margin-top: 10px;
    border: 1px solid #c0c4cc;
    overflow: hidden;
    border-radius: 5px;
		padding: 20px;
	}
	.opinion-input .el-upload.el-upload--text{
		padding: 5px;
	}
</style>