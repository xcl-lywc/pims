 <!--
  检查材料
  -->
<template>
  <div>
    <h2 class="page-title">项目受理</h2>
    <div class="block-wrap">
      <h4 class="block-title"></h4>
      <div class="block-body">
				<div class="body-content">
					<base-info :projectId="projectId"></base-info>
				</div>
      </div>
			<div class="block-bottom">
				<div class="btn-t4">
					<el-button type="primary" @click="yes" size="small">受理</el-button>
					<el-button @click="no" size="small">返回修改</el-button>
					<el-button @click="stop" size="small">关闭</el-button>
				</div>
			</div>
    </div>
  </div>

</template>

<style scoped>

</style>

<script>
	import  baseInfo from '../projectDeclare/BaseInfo.vue';
  export default {
		components: {
			'base-info': baseInfo,
		},
		data(){
			return{
				projectId:sessionStorage.getItem('acceptanceId'),
				detailData:null,
				// budgetRoute:['','国家专项资金','市财政资金','区财政资金','其他资金'],
				//isShowBaseInfo:true,
				//isLoading:true,
				assignee:sessionStorage.getItem("assignee"),
			}
		},
		methods: {
			/* 
				通过、驳回、关闭
			 */
			yes(){
				this.$confirm('是否受理该项目？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.adopt();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '您已取消受理该项目'
					});          
				});
			},
			no(){
				this.$prompt('请输入返回修改原因', '提示', {
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
			* 获取详情
			*/
			getDetail(){
				this.axios.get(`${this.common.basePath}/project/detail/${this.projectId}`,this._detailParams()).then( (response) => {
					if(response.data.meta.code === 0){
						this.detailData = response.data.data;
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
						id:this.projectId,
					}
				}
			},
			
			/* 
			 通过
			 */
			adopt(){
				var formData = {
					read_status:1,
					curStatus:2,
					instanceId:this.detailData.instanceId,
					assignee:this.assignee
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({path: '/project_set_up/acceptance'});
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
					curStatus:2,
					instanceId:this.detailData.instanceId,
					assignee:this.assignee,
					rejectReason:value
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success('请等待申报单位修改后重新提交...', 20);
						this.$router.push({path: '/project_set_up/acceptance'});
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
					instanceId:this.detailData.instanceId,
					rejectReason:value
				}
				this.axios.post(`${this.common.basePath}/activiti/instance/delete`,formData).then( (response) => {
					if(response.data.meta.code === 0) {
						this.$message.success('该项目已关闭！！', 20);
						this.$router.push({path: "/project_set_up/acceptance"})
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
		},
		mounted() {
			/* 
			获取详情 
			 */
			this.getDetail();
		},
  }
</script>
