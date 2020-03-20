 <!--
		专家查询
	-->
<template>
  <div>
    <h2 class="page-title">专家查询</h2>
    <div class="block-wrap">
      <h4 class="block-title">查询表</h4>
      <div class="block-body">
        <div class="body-operation">
          <el-form :model="searchForm" ref="searchForm" size="small" label-width="100px" inline class="padt10">
            <el-form-item label="名称" prop="keyWords">
              <el-input v-model="searchForm.keyWords" placeholder="请输入项目名"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="stage">
              <el-select v-model="searchForm.stage" placeholder="请选择">
                <el-option
                  v-for="item in commonJs.projectStatusData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报单位" prop="orgId">
              <el-select v-model="searchForm.orgId" placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报时间" prop="timeRange">
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
            <el-form-item label="">
              <el-button type="primary" @click="getQueryList">搜索</el-button>
              <el-button type="default" @click="resetSearchForm('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div> 
        <el-row class="body-content" :gutter="20" v-loading="loading">
          <el-col :span="24">
            <el-table :data="tableData.rows" border style="width: 100%" @row-click="handleClick">
              <el-table-column type="index" label="序号" :index="indexMethod"></el-table-column>
              <el-table-column prop="name" label="项目名称"></el-table-column>
              <el-table-column prop="orgName" label="申报单位" width="200"></el-table-column>
              <el-table-column prop="createTime" label="申报时间" width="150">
                <template slot-scope="scope">
                    {{common._convertDate(scope.row.createTime, 'yyyy年MM月dd日')}}
                </template>       
              </el-table-column>
              <el-table-column prop="budgetMoney" label="项目金额" width="150"></el-table-column>
              <el-table-column prop="state" label="当前状态" width="150"> 
                <template slot-scope="scope">
                  <span :class="common.showStatusText(scope.row.curStatus).stageColor">{{common.showStatusText(scope.row.curStatus).name}}</span>
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
        <el-col :span="8" :offset="4">
          <div class="block">
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
        </el-col>
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
        this.axios.post(`${this.common.basePath}/project/expert`, this._queryListParams() ).then( (response) => {
           this.tableData = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
       },
      _queryListParams(){
        return { 
          	expert:     this.expertId,
            pageNum:    this.elementPageData.pageNum,
            pageSize:   this.elementPageData.pageSize,
 
        }
       },
      /*
       * 查询专家列表
       */
      getQueryExpertList(){
        this.axios.get(`${this.common.basePath}/hr_users/expert/list`, '' ).then( (response) => {
           this.expertList = response.data.data;
           this.loading = false;
        }).catch( (error) => {
          this.loading = false;
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
       * 根据条件查询列表
       */
      onSubmit(){
      	this.getQueryList();
      },
      /*
       * 显示被点击当前行详情
       */
      handleClick(data){
        this.dialogVisible = true;
        this.currentRowDetail = data;
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
    	this.getQueryExpertList();
    	this.getQueryList();
    },
    data() {
      return {
        loading: true,
      	elementPageData: {               //分页需要的数据
            defaultData:  this.common.elementPagination,
            pageNum:      this.common.elementPagination.pageNumDefault,
            pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        userData:  JSON.parse(sessionStorage.getItem('userData')),
        expertList: {rows: [], total:0},    //专家列表
        expertId:   null,  //被选中的专家Id
        tableData: {rows: [], total: 0}, 
				formInline: {
          user: '',
          region: ''
        },
        dialogVisible:   false,
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