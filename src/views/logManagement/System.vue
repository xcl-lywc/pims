 <!--
		系统日志
	-->
<template>
  <div>
    <h2 class="page-title">系统日志</h2>
    <div class="block-wrap">
      <h4 class="block-title">系统日志</h4>
      <div class="block-body">
        <el-row>
          <el-col :span="24">
            <el-table :data="tableData.rows" stripe style="width: 100%">
              <el-table-column fixed type="index" :index="indexMethod" align="center" class-name="border-index"></el-table-column>
              <el-table-column prop="create_time" label="时间" width="150">
                <template slot-scope="scope">
                  {{common._convertDate(scope.row.create_time, 'yyyy年MM月dd日')}}
                </template>
              </el-table-column>
              <el-table-column prop="history_type" label="异常对象" width="150">
                <template slot-scope="scope">
                  {{ common._controlTable(scope.row.history_type) }}
                </template>
              </el-table-column>
              <el-table-column prop="history_type" label="异常信息" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.message }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120"  header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" size="small" type="success"><i class="fa fa-eye"></i> 查看</el-button>
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
         layout="total, sizes, prev, pager, next, jumper"
         :total="tableData.total">
        </el-pagination> 
      </div>
    </div>
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      width="60%">
      <div v-if="currentRowDetail" class="block-wrap">
        <div class="block-body not-auto-expand">
          <el-form
            :model="currentRowDetail"
            ref="projectForm"
            class="show-form"
            size="middle">
            <el-row :gutter="0">
              <el-col :span="24">
                <h4 class="block-depart-title"><i class="fa fa-list-alt title-icon"></i> 基本信息 </h4>
                <el-form-item label="时间：">{{common._convertDate(currentRowDetail.create_time, 'yyyy年MM月dd日')}} </el-form-item>
                <el-form-item label="异常类型：">{{currentRowDetail.exception_type}} </el-form-item>
                <el-form-item label="异常信息：">{{currentRowDetail.message}} </el-form-item>
                <el-form-item label="url：">{{currentRowDetail.from_url}} </el-form-item>
                <el-form-item label="异常数据：">{{currentRowDetail.date}} </el-form-item>
                <el-form-item label="用户：">{{currentRowDetail.creator}} </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div> 
</template>

<script>
  export default {
    methods: {
        /*
       * 根据条件查询用户列表
       */
      getQueryList(){
        this.axios.get(`${this.common.basePath}/exceptionLog`, this._queryListParams() ).then( (response) => {
          this.tableData = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
       },
      _queryListParams(){
        return {
          params: {
            pageNum:    this.elementPageData.pageNum,
            pageSize:   this.elementPageData.pageSize,
          }
        }
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
      indexMethod(index) {
        return index * 1 + 1;
       },
      /*
       * 显示被点击当前行详情
       */
      handleClick(data){
        this.dialogVisible = true;
        this.currentRowDetail = data;
      },
    },
    mounted() {
      this.getQueryList();
    },
    data() {
      return {
        dialogVisible: false,
        tableData: {rows: [], total: 0}, 
        currentRowDetail: null, //当前被操作的详情数据
        elementPageData: {               //分页需要的数据
            defaultData:  this.common.elementPagination,
            pageNum:      this.common.elementPagination.pageNumDefault,
            pageSize:     this.common.elementPagination.pageSizeDefault,
        },
      }
    }
  }
</script>

<style>

</style>