<!-- 
 项目管理
 -->
<template>
  <div id="project-management">
    <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" v-if="detailVisible" @click="detailVisible = false">返回</el-button>
    <div v-show="!detailVisible">
      <h2 class="page-title">项目管理</h2>
      <div class="block-wrap" v-loading="loading">
        <h4 class="block-title">项目列表</h4>
        <div class="block-body">
          <el-row>
            <el-col :span="24">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                @row-click="tableRowClick"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column fixed type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" width="60" label="序号" :index="indexMethod" class-name="border-index"></el-table-column>
                <el-table-column prop="name" label="项目名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="profession" label="创建日期">
                  <template slot-scope="scope">
                    {{ common._convertDate(scope.row.create_time, "yyyy年MM月dd日") }}
                  </template>
                </el-table-column>
                <el-table-column prop="total" label="总预算"></el-table-column>
                <el-table-column prop="profession" label="计划开始日期">
                  <template slot-scope="scope">
                    {{ common._convertDate(scope.row.plan_begin_time, "yyyy年MM月dd日") }}
                  </template>
                </el-table-column>
                <el-table-column prop="profession" label="计划结束日期">
                  <template slot-scope="scope">
                    {{ common._convertDate(scope.row.plan_end_time, "yyyy年MM月dd日") }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="280"  header-align="center" align="center">
                  <template slot-scope="scope">
                    <div class="text-center">
                      <el-button type="success" size="small" @click="tableItemClick('view', scope.row.id)"><i class="fa fa-eye fa-in-button"></i>查看</el-button>
                      <el-button type="primary" size="small" @click.stop="tableItemClick('edit', scope.row.id)">
                      <i class="fa fa-edit fa-in-button"></i>编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="small" @click.stop="deleteItem(scope.row.id)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="block-bottom">
          <!-- <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multipleSelection.length == 0" @click="deleteItem(false)">批量删除</el-button> -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="currentPerPage"
            background
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <detail v-if="detailVisible" :mode="mode" :id="itemId" @submitSuccess="afterSubmit"></detail>
  </div> 
</template>

<script>
  import detail from "./Detail"
  export default {
    data() {
      let self = this
      // 验证邮箱格式
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入邮箱'));
        } else {
          if(self.common.emailReg.test(value)){
            return callback();
          } else {
            return callback(new Error('请输入正确的邮箱'));
          }
        }
      };
      return {
        loading: false,

        //表格内容 + 分页
        tableData:         [],
        multipleSelection: [],
        currentPage:    1,
        currentPerPage: 10,
        total:          0,
        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        },
        // 控制编辑和查看详情
        detailVisible: false,
        mode:          "view",
        itemId:        null,
      }
    },
    components: {
      'detail': detail
    },
    watch: {
      'editDialogVisible' : {
        handler (newV, oldV) {
          if(!newV && newV != oldV) {
            this.resetForm("expertForm")
          }
        },
        deep: true
      }
    },
    mounted() {
      let self = this
      //查询字典
      // self.common.getDictionaryData(2).then((response) => {
      //   self.industryTree = response
      // })
      self.getTableListData()
    },
    methods: {
      /**
       * 返回编号
       * @param  {number} index 当前数据中的index
       * @return {[type]}       [description]
       */
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * this.currentPerPage;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.currentPerPage = val
        this.getTableListData() 
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTableListData()
      },
      /**
       * 查询列表
       * @return {[type]} [description]
       */
      getTableListData() {
        this.loading = true
        let cofig = {
          method: "get",
          url:    `${this.common.basePath}/budget`,
          params: {
            pageNum:  this.currentPage,
            pageSize: this.currentPerPage
          }
        }
        this.axios(cofig).then((response) => {
          this.tableData = response.data.data.rows
          this.total     = response.data.data.total
          this.loading   = false
        }).catch((error) => {
          this.$message.error(error)
          this.loading = false
        })
      },
      /**
       * 点击树节点的回调 重写expertForm.profession(数组字符串)
       * @param  {object}  data          节点data
       * @param  {boolean} checked       是否被选中
       * @param  {[type]}  indeterminate 
       * @return none
       */
      handleCheckChange(data, checked, indeterminate) {
        let list = JSON.parse(JSON.stringify(this.$refs.industryTree.getCheckedNodes()))
        let mapList = list.map((item) => {
          return item.id
        })
        this.expertForm.profession = mapList.join(",")
      },
      /**
       * 点击表格的行 跳转至详情
       * @param  {[type]} row    [description]
       * @param  {[type]} event  [description]
       * @param  {[type]} column [description]
       * @return {[type]}        [description]
       */
      tableRowClick (row, event, column) {
        this.mode   = "view"
        this.itemId = row.id
        this.detailVisible = true
        document.getElementsByClassName("content-wrap")[0].scrollTo(0, 0) //回到页面顶部
      },
      /**
       * 点击详情/ 编辑 (详情已改为点击行触发)
       * @param  {[type]} mode   [description]
       * @param  {[type]} itemId [description]
       * @return {[type]}        [description]
       */
      tableItemClick (mode, itemId) {
        this.mode   = mode
        this.itemId = itemId
        this.detailVisible = true
        document.getElementsByClassName("content-wrap")[0].scrollTo(0, 0) //回到页面顶部
      },
      /**
       * 子组件提交后 重新查询
       * @return {[type]} [description]
       */
      afterSubmit () {
        this.getTableListData()
        this.detailVisible = false
      },
      /**
       * 删除
       * @param  {array} itemId 需要删除的Id数组
       * @return {[type]}         [description]
       */
      deleteItem(itemId) {
        let self = this
        let config = {
          method: "patch",
          url:    `${self.common.basePath}/budget/delete/${itemId}`,
          data:   {}
        }

        self.$confirm("删除后需要重新添加", "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消",
          type: 'warning',
        }).then(_ => {
          self.axios(config)
          .then((response) => {
            self.$message.success(response.data.meta.message)
            self.getTableListData()
          })
          .catch((error) => {
            self.$message.error(error)
          })
        })
      },
      /**
       * 重置表单
       * @param  {string} formName 表单名ref
       * @return {[type]}          [description]
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>