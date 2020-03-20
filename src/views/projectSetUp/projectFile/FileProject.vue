<!-- 
	提交立项材料
 -->
<template>
  <div>
  	<h2 class="page-title">审核归档</h2>
  	<div class="block-wrap">
  		<h4 class="block-title">审核归档</h4>
  		<div class="block-body">
  			<div class="body-content">
				<div class="grid-content_f bg-gray">
					<el-form size="small" label-width="200px" v-if="detailData">
						<el-form-item label="财政意见-调整预算金额：" prop="budgetFinance">
							<span>{{detailData.budgetFinance+"万元"}}</span>
						</el-form-item>
						<el-form-item label="财政专家评审意见：">
							<a v-if="financeDudget.length > 0" class="fl" :href="'pics'+financeDudget[0].response.data.path" target="view_window">
									{{financeDudget[0].name}}
							</a>
						</el-form-item>
						<el-form-item label="项目建设方案(终审稿)：">
							<a v-if="financePlan.length > 0" class="fl" :href="'pics'+financePlan[0].url" target="view_window">
									{{financePlan[0].name}}
							</a>
						</el-form-item>
					</el-form>
				</div>
  				<!-- <ul class="contents">
						<h4 class="block-depart-title">财政审核意见终审稿</h4>
						<li>
							<span class="fl item">项目建设方案：</span>
							<a v-if="financePlan.length > 0" class="fl" :href="'pics'+financePlan[0].url" target="view_window">
								{{financePlan[0].name}}
							</a>
						</li>
						<li>
							<span class="fl item">项目预算：</span>
							<a v-if="financeDudget.length > 0" class="fl" :href="'pics'+financeDudget[0].url" target="view_window">
								{{financeDudget[0].name}}
							</a>
						</li>
						 <li>
							<span class="fl item">项目方案简报：</span>
							<a v-if="projectBriefing.length > 0" class="fl" :href="'pics'+projectBriefing[0].url" target="view_window">
								{{projectBriefing[0].name}}
							</a>
						</li>
  				
  				</ul> -->
  			</div>
  		</div>
  		<div class="block-bottom">
				<div class="btn-t4">
					<el-button type="primary" @click="yes" size="small">通过</el-button>
					<el-button @click="no" size="small">返回修改</el-button>
				</div>
  		</div>
  	</div>
  </div>
</template>

<script>
	import fileList from "@/components/FileList.vue"
  export default {
		components: {
			"file-list": fileList
		},
		data(){
			return{
				desc:'',
				projectId: this.$route.params.id,
				// rowData:sessionStorage.getItem("rowFileInfo"),
				// rowDataArr:[],
				detailData: {},
				financePlan: [],
				financeDudget: [],
				// projectBriefing: [],
			}
		},
		methods: {
			
			/* 
				通过、驳回、
			*/
			yes(){
				let self = this
				self.$confirm('是否通过该项目？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					self.adopt();
				}).catch((error) => {      
				});
			},
			no(){
				let self = this
				self.$prompt('请输入返回修改原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					self.reject(value);
				}).catch(() => {
				});
			},
			
			/* 
			通过
			*/
			adopt(){
				var formData = {
					read_status:1,
					curStatus:12,
					instanceId: this.detailData.instanceId,
					assignee: JSON.parse(sessionStorage.getItem('userData')).id
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("归档"+response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/file'});
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
					curStatus:12,
					instanceId: this.detailData.instanceId,
					assignee: JSON.parse(sessionStorage.getItem('userData')).id,
					rejectReason:value
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success('请等待申报单位修改财政评审相关意见后重新提交...', 20);
						this.$router.push({path: '/project_set_up/file'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
			
		},
		mounted() {
			let self = this;
			// var rowDataArr = [];
			// rowDataArr.push(JSON.parse(this.rowData))
			// that.rowDataArr = rowDataArr
			self.axios.get(`${self.common.basePath}/project/detail/${self.projectId}`, {params: {id: self.projectId}}).then((response) => {
				self.detailData = response.data.data
				self.financePlan = JSON.parse(self.detailData.financePlan) || []
				self.financeDudget = JSON.parse(self.detailData.financeDudget) || []
				// self.projectBriefing = JSON.parse(self.detailData.projectBriefing) || []
			}).catch((error) => {
				self.$message.error(error)
			})
		},
  }
</script>

<style lang="less" scoped>
	.grid-content_f {
		border-radius: 4px;
		min-height: 200px;
		padding: 18px 24px;
		box-sizing: border-box;
		margin-bottom: 15px;
		.base-title{
			height: 39px;
			padding: 0 0 0 20px;
			margin: 0 0 18px 0;
			font-size: 16px;
			font-weight: normal;
			line-height: 39px;
			border-bottom: 1px solid #d8e1f6;
			img{
				width: 30px;
				height: 30px;
				vertical-align: middle;
				margin: 5px 5px 0 0;
			}
		}
		.el-form-item{
			.a-style{
				color: #147cf4;
				text-decoration: none;
			}
			.a-style:hover{
				color: #0000FF;
			}
		}
		.el-form-item__label{
			background: none;
			border-right:none;
		}
	}
	.bg-gray {
		background: #f6fbfe;
	}
</style>