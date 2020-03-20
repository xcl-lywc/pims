 <!--
		安全日志
	-->
<template>
  <div>
    <h2 class="page-title">安全日志</h2>
    <div class="block-wrap">
      <h4 class="block-title">安全日志</h4>
      <div class="block-body">
        <el-row>
          <el-col :span="24">
            <el-table :data="tableData.rows" stripe style="width: 100%">
              <el-table-column fixed type="index" :index="indexMethod" align="center" class-name="border-index"></el-table-column>
              <el-table-column prop="create_time" label="日期" width="150">
                <template slot-scope="scope">
                  {{common._convertDate(scope.row.create_time, 'yyyy年MM月dd日')}}
                </template>
              </el-table-column>
              <el-table-column prop="creator" label="账号" width="200"></el-table-column>
              <el-table-column prop="type" label="类型" width="150">
                <template slot-scope="scope">
                  {{ common._controlTable(scope.row.type) }}
                </template>
              </el-table-column>
              <el-table-column prop="desc_info" label="信息" show-overflow-tooltip></el-table-column>
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
  </div> 
</template>

<script>
  export default {
    methods: {
        /*
       * 根据条件查询用户列表
       */
      getQueryList(){
        this.axios.get(`${this.common.basePath}/securityLog`, this._queryListParams() ).then( (response) => {
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
    },
    mounted() {
      this.getQueryList();
    },
    data() {
      return {
        tableData: {rows: [], total: 0}, 
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