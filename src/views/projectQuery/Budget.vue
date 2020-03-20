 <!--
		预算单位查询
	-->
<template>
  <div>
    <h2 class="page-title">预算单位查询</h2>
    <div class="block-wrap">
			<h4 class="block-title">预算单位查询</h4>
			<div class="block-body">
        <div class="body-operation">
          <el-form :model="searchForm" ref="searchForm" size="middle" label-width="100px" inline class="padt10 danwei-form">
            <el-row>
              <el-col :span="11">
                <el-form-item label="名称：" prop="keyWords">
                  <el-input v-model="searchForm.keyWords" placeholder="请输入项目名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="状态：" prop="stage">
                  <el-select v-model="searchForm.stage" placeholder="请选择">
                    <el-option
                      v-for="item in common.projectStatusData()"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="申报单位：" prop="orgId">
                  <el-select filterable v-model="searchForm.orgId" placeholder="请选择">
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="申报时间：" prop="timeRange">
                  <el-date-picker
                    v-model="searchForm.timeRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getQueryList">搜索</el-button>
                  <el-button type="default" @click="resetSearchForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div> 
				<el-row class="body-content" :gutter="20" v-loading="loading">
					<el-col :span="24">
						<el-table :data="tableData.rows" style="width: 100%" @row-click="handleClick">
              <<el-table-column type="index"  label="序号" :index="indexMethod" align="center" class-name="border-index"></el-table-column>
              <el-table-column prop="name" label="项目名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="cursor-pointer">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orgName" label="申报单位" width="200">
                <template slot-scope="scope">
                  <span class="cursor-pointer">{{scope.row.orgName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="申报时间" width="150">
                <template slot-scope="scope">
                  <span class="cursor-pointer">{{common._convertDate(scope.row.createTime, 'yyyy年MM月dd日')}}</span>
                </template>       
              </el-table-column>
              <el-table-column prop="budgetMoney" label="项目金额" width="150">
                <template slot-scope="scope">
                  <span class="cursor-pointer">{{scope.row.budgetMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" label="当前状态" width="150"> 
                <template slot-scope="scope">
                  <span :class="common.showStatusText(scope.row.stage) ? common.showStatusText(scope.row.stage).stageColor : '' ">{{common.showStatusText(scope.row.stage) ? common.showStatusText(scope.row.stage).name : ''}}</span>
                </template>       
              </el-table-column> 
              <el-table-column prop="state" label="项目进度" width="350"> 
                <template slot-scope="scope"> 
                  <el-progress :percentage=" parseInt(scope.row.schedule * 100) "></el-progress>
                </template>       
              </el-table-column>
						</el-table>
					</el-col>
				</el-row>
			</div>
			<div class="block-bottom">
        <el-pagination :span="24" class="ce-pagination"
         @size-change="handleSizeChange($event)"
         @current-change="handleCurrentChange($event)"
         :current-page="elementPageData.pageNum"
         :page-sizes="elementPageData.defaultData.pageSizes"
         :page-size="elementPageData.defaultData.pageSizeDefault"
         background
         small
         layout="total, sizes, prev, pager, next, jumper"
         :total="tableData.total">
        </el-pagination>
			</div>
    </div>
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      width="50%">
        <project-detail :detail="currentRowDetail"></project-detail>
    </el-dialog>
  </div>
</template>

<script>
  import detail from './DetailComponent.vue'
  export default {
    components: {
      'project-detail': detail,
    },
    methods: {
      /**
       * 返回编号
       * @param  {number} index 当前数据中的index
       * @return {[type]}       [description]
       */
      indexMethod(index) {
        return index + 1 + (this.elementPageData.pageNum - 1) * this.elementPageData.pageSize;
      },
      /*
       * 根据条件查询用户列表
       */
      getQueryList(){
        this.axios.post(`${this.common.basePath}/project/org`,this._queryListParams() ).then( (response) => {
           this.tableData = response.data.data;
           this.loading = false;
        }).catch( (error) => {
          this.loading = false;
          this.$message.error(error);
        });
       },
      _queryListParams(){
        this.searchForm.beginTime = this.searchForm.timeRange ? new Date(this.searchForm.timeRange[0]).getTime() : null;
        this.searchForm.endTime = this.searchForm.timeRange ? new Date(this.searchForm.timeRange[1]).getTime() : null;
        this.searchForm.pageNum = this.elementPageData.pageNum;
        this.searchForm.pageSize = this.elementPageData.pageSize;
        this.searchForm.timeRange = null;
        return this.searchForm;
       },
      /*
       * 查询申报单位
       */
      getQueryUserList(){
        this.axios.post(`${this.common.basePath}/hr_users/user/list`, {id: 6 } ).then( (response) => {
           this.userList = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
       },
			/*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
        this.elementPageData.pageNum = val;
        this.getQueryList();
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){
        this.elementPageData.pageSize = val;
        this.getQueryList();
       },
      /*
       * 显示被点击当前行详情
       */
      handleClick(data){
        sessionStorage.setItem("declareProjectIsEdit",1)
				this.$router.push({
					name:'DeclareDetail',
					params:{
						id:data.id,
					}
				})
      },
      /**
       * 重置表单
       * @return {[type]} [description]
       */
      resetSearchForm (formName) {
        this.$refs[formName].resetFields()
      },
    },
    mounted() {
      this.getQueryUserList();
    	this.getQueryList();
    },
    data() {
      return {
        loading: true,
        dialogVisible:   false,
      	elementPageData: {               //分页需要的数据
            defaultData:  this.common.elementPagination,
            pageNum:      this.common.elementPagination.pageNumDefault,
            pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        userData:  JSON.parse(sessionStorage.getItem('userData')),
        tableData: {rows: [], total: 0}, 
				formInline: {
          user: '',
          region: ''
        },
        currentRowDetail: null, //被选中的当前行详情
        userList: null, //申报单位数据
        searchForm:{
          orgId:     null, //单位Id
          keyWords:  null, //模糊查询条件
          stage:     null, //项目阶段：1被驳回 2待受理 3待预审 4待审批 5待上会 6待财政审批 7待归档 8进行中
          beginTime: null, //开始时间
          endTime:   null, //结束时间
          timeRange: null, //时间段
          pageNum:   null, //当前页面
          pageSize:  null, //分页条数
        }, 
      }
    }
  }
</script>

<style>
	
</style>