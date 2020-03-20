<!-- 
 项目查询
 -->
<template>
  <div>
    <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" v-if="detailVisible" @click="detailVisible = false">返回</el-button>
    <div v-show="!detailVisible">
      <h2 class="page-title">项目查询</h2>
      <div class="block-wrap" v-loading="loading">
        <h4 class="block-title">项目列表</h4>
        <div class="block-body">
          <div class="body-operation">
            <el-form :model="searchForm" ref="searchForm" size="middle" label-width="100px" inline class="padt10">
              <el-form-item label="名称" prop="name">
                <el-input v-model="searchForm.name" placeholder="请输入项目名"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="getTableListData('manual')">搜索</el-button>
                <el-button type="default" @click="resetSearchForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-row class="body-content">
            <el-col :span="24">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column fixed type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" :index="indexMethod" width="60" label="序号" fixed="left" class-name="border-index"></el-table-column>
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
                <el-table-column label="操作" width="120" header-align="center" align="center" fixed="right">
                  <template slot-scope="scope">
                    <div class="text-center">
                      <el-button type="success" size="small" @click="tableItemClick('view', scope.row.id)">
                        <i class="fa fa-eye fa-in-button"></i>查看
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="block-bottom">
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
    <detail v-if="detailVisible" :mode="mode" :id="itemId"></detail>
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

        //搜索表单
        searchForm: {
          name: null,
        },

        detailVisible: false,
        mode:          "view",
        itemId:        null,

        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        }
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
      self.common.getDictionaryData(2).then((response) => {
        self.industryTree = response
      })
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
       * @param  {string} manual 是否是点击点击搜索查询 ? 重置分页 : 不清空分页
       * @return {[type]}        [description]
       */
      getTableListData(manual) {
        this.loading = true

        if(manual == "manual") { //手动查询时 重回第一页
          this.currentPage    = 1
        }
        this.searchForm.pageNum  = this.currentPage
        this.searchForm.pageSize = this.currentPerPage

        let cofig = {
          method: "get",
          url:    `${this.common.basePath}/budget`,
          params: this.searchForm
        }

        this.axios(cofig).then((response) => {
          this.tableData = response.data.data.rows
          this.total     = response.data.data.total
          this.loading   = false
        }).catch((error) => {
          self.$message.error(error)
          this.loading = false
        })
      },
      /**
       * 重置表单
       * @return {[type]} [description]
       */
      resetSearchForm () {
        this.$refs.searchForm.resetFields()
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
       * 验证account是否可用
       * @return {string} 验证完成的promise回调信息
       */
      validateAccount () {
        let self = this

        let cofig = {
          method: "get",
          url:    `${this.common.basePath}/hr_users/judge`,
          params: {
            account: this.expertForm.account
          }
        }
        let promise = new Promise((resolve, reject) => {
          this.axios(cofig)
          .then((response) => {
            resolve("success")
          })
          .catch((error) => {
            reject(error)
          })
        })
        return promise
      },
      /**
       * 点击详情/ 编辑
       * @param  {[type]} mode   [description]
       * @param  {[type]} itemId [description]
       * @return {[type]}        [description]
       */
      tableItemClick (mode, itemId) {
        this.mode          = mode
        this.itemId        = itemId
        this.detailVisible = true
        document.getElementsByClassName("content-wrap")[0].scrollTo(0, 0) //回到页面顶部
      },
      /**
       * 根据Id获取详情
       * @param  {number} itemId 表格中的Id
       * @return none
       */
      getDetail (itemId) {
        let self = this
        let cofig = {
          method: "get",
          url:    `${self.common.basePath}/hr_users/details`,
          params: {
            id: itemId
          }
        }
        self.axios(cofig)
        .then((response) => {
          self.expertForm = response.data.data
          self.$nextTick(()=> {
            self.$refs.expertForm.clearValidate()
          })
          let industryList = self.expertForm.professiones.map((item) => {
            return item.id
          })
          //设置选中
          self.$refs.industryTree.setCheckedKeys(industryList)
          self.expertForm.profession = industryList.join(",")
        })
        .catch((error) => {
          self.$message.error("获取详情失败")
          self.editDialogVisible = false
        })
      },
      /**
       * 提交表单
       * @param  {string} formName 表单名ref
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        let self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            let config = {
              method: "patch",
              url:    `${self.common.basePath}/hr_users/user/update/${self.expertForm.id}`,
              data:   self.expertForm
            }
            self.axios(config)
            .then((response) => {
              self.$message.success(response.data.meta.message)
              self.editDialogVisible = false
              self.getTableListData()
            })
            .catch((error) => {
              self.$message.error(error)
            })
          } else {
            return false;
          }
        });
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