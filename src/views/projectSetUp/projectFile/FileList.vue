 <!--
    待归档项目列表 
  -->
<template>
  <div>
    <h2 class="page-title">项目归档</h2>
    <div class="block-wrap">
      <h4 class="block-title">审核列表</h4>
      <div class="block-body">
        <div class="body-content">
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData.rows" stripe style="width: 100%">
                <!-- <el-table-column  type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" width="60" label="序号" :index="indexMethod" fixed class-name="border-index"></el-table-column>
                <el-table-column prop="processVariables.projectNum" label="项目编号" width="120"></el-table-column>
                <el-table-column prop="processVariables.name" label="项目名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span @click="openDetails(scope.row)" class="name-style">
                      {{scope.row.processVariables.name}}
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="processVariables.name" label="轮次" width="50">
                  <template slot-scope="scope">
                    <span class="name-style">
                      {{scope.row.processVariables.rotation}}
                    </span>
                  </template>
                </el-table-column> -->
                <el-table-column prop="processVariables.company" label="申报单位" width="120">
                  <template slot-scope="scope">
                    <span>
                      <!-- {{scope.row.processVariables.company | convertToText}} -->
                      {{scope.row.processVariables.companyName}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.applyTime" label="申报时间" width="180">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.processVariables.applyTime | formatDate}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.budgetMoney" label="项目金额" width="180">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.processVariables.budgetMoney+'万元'}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.cur_status" label="当前状态" width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.processVariables.cur_status == 12">待归档</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
                    <!-- <el-button type="success" size="small" @click.stop="openDetails(scope.row)">查看</el-button> -->
                    <el-button type="primary" icon="" size="small" @click.stop="fileClick(scope.row)">审批</el-button>
                    <el-button type="primary" size="small" @click.stop="goToDeclareAgain(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-bottom">
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
    </div>
  </div> 
</template>

<script>
  import {formatDate} from '../../../plugins/data.js';
  import {convertToText} from '../../../plugins/convertToText.js';
  export default {
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
    },
    filters: {
      /* 
        转化时间戳
      */
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      /* 
      转化申报单位 id=>文本
      */
      convertToText(idValue){
        return convertToText(idValue,JSON.parse(sessionStorage.getItem("unitArr")));
      }
    },
    methods: {
      /* 
        跳转至继续申报进行编辑
      */
      goToDeclareAgain(row, type){
        sessionStorage.setItem("rowDeclareInfo",JSON.stringify(row))
        sessionStorage.setItem('historyPath', this.$route.path)
        this.$router.push({
          name:'DeclareAgain',
          params:{
            id:row.processVariables.projectId,
            type: type ? row.processVariables.cur_status : "edit"
          }
        })
      },
      /* 
        获取申报单位
      */
      getDeclareUnit(){
        var formData = {
          id:6,
        }
        // this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
        this.axios.post(`${this.common.basePath}/hr_users/user/list`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            var declareUnitList = response.data.data;
            sessionStorage.setItem("unitArr",JSON.stringify(declareUnitList))
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
    
      /* 
        项目详情 row, event, column
      */
      openDetails(row) {
        // sessionStorage.setItem("declareProjectId",row.processVariables.projectId)
        sessionStorage.setItem("declareProjectIsEdit",1)
        this.$router.push({
          name:'DeclareDetail',
          params:{
            id:row.processVariables.projectId,
          }
        })
      },
    
      /* 
        项目归档
       */
      fileClick(row){
        sessionStorage.setItem("rowFileInfo",JSON.stringify(row))
        this.$router.push({name: 'FileProject', params: {id : row.processVariables.projectId}});
      },
      
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
        //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
        this.axios.get(`${this.common.basePath}/project/page`,this._acceptanceListParams()).then( (response) => {
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
            status:7,
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
      
      /* 
      申报单位
      */
      this.getDeclareUnit();
    },
    
  }
</script>

<style>
  
</style>