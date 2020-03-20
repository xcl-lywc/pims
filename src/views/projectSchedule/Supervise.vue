 <!--
		项目进度监督
	-->
<template>
  <div>
    <h2 class="page-title">项目进度</h2>
    <div class="block-wrap">
			<h4 class="block-title">项目进度监督</h4>
      <div class="block-body">
				<div class="body-operation">
					<el-row :gutter="20">
						<el-col :span="12">
								<!-- <el-button type="" icon="fa fa-upload" size="small"> 导出所选</el-button> -->
						</el-col>
						<el-col :span="12" :offset="0"></el-col>
					</el-row>
				</div>
				<div class="body-content">
					<el-row>
						<el-col :span="24">
							<el-table :data="tableData.rows" stripe border style="width: 100%">
								<el-table-column fixed type="selection" width="50"></el-table-column>
								<el-table-column type="index" :index="indexMethod"></el-table-column>
								<el-table-column prop="createTime" label="日期" width="150">
									<template slot-scope="scope">
										<span>
											{{scope.row.createTime | formatDate}}
										</span>
									</template>
								</el-table-column>
								<el-table-column prop="name" label="项目名称" width="240"></el-table-column>
								<el-table-column prop="orgName" label="负责人" width="150"></el-table-column>
								<el-table-column prop="payMoney" label="项目集资(万元)" width="240"></el-table-column>
								<el-table-column label="进度(百分比)">
									<template slot-scope="scope">
										<el-progress :percentage="scope.row.schedule*100"></el-progress>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="block-bottom">
				<el-col :span="12" :offset="0"></el-col>
				<el-col :span="8" :offset="4">
					<div class="block">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="elementPageData.pageNum"
							:page-sizes="elementPageData.defaultData.pageSizes"
							:page-size="elementPageData.defaultData.pageSizeDefault"
							background
							small
							layout="total, sizes, prev, pager, next, jumper"
							:total="tableData.total">
						</el-pagination>
					</div>
				</el-col>
			</div>
    </div>
  </div> 
</template>

<script>
	import {formatDate} from '../../plugins/data.js';
  export default {
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
    	项目序号
    	*/
    	indexMethod(index) {
    		return (index+1) * 1;
    	},
    	
    	/*
    	* 改变当前页码触发此事件
    	* @param {number} val 当前页码
    	*/
    	handleCurrentChange(val){
    		this.elementPageData.pageNum = val;
    		this.getList();
    	},
    	
    	/*
    	* 改变每页条数触发此事件
    	* @param {number} val 当前数据
    	*/
    	handleSizeChange(val){
    		this.elementPageData.pageSize = val;
    		this.getList();
    	},
    	
    	/*
    	* 获取列表
    	*/
    	getList(){
    		this.axios.get(`${this.common.basePath}/checkpoint/point/all`,this._acceptanceListParams()).then( (response) => {
    			if(response.data.meta.code === 0){
    				// this.$message.success(response.data.meta.message, 20);
    				this.tableData = response.data.data;
    			}else{
    				this.$message.error(response.data.meta.message, 20);   
    			}
    			
    		}).catch( (error) => {
    			this.$message.error(error);
    		});
    	},
    	_acceptanceListParams(){
    		return {
    			params: {
    				projectId:"",
    				pageSize: this.elementPageData.pageSize,
    				pageNum:  this.elementPageData.pageNum,
    			}
    		}
    	},
    
		},
    mounted() {
    	/* 
    	列表展示
    	*/
    	this.getList();
    },
    data() {
      return {
				elementPageData: {               
					//分页需要的数据
					defaultData:  this.common.elementPagination,
					pageNum:      this.common.elementPagination.pageNumDefault,
					pageSize:     this.common.elementPagination.pageSizeDefault,
				},
        tableData: {rows: [], total: 0},
				currentPage: 1,
      }
    }
  }
</script>

<style>
	
</style>