<!-- 
 专家管理
 -->
<template>
  <div>
    <h2 class="page-title">专家管理</h2>
    <div class="block-wrap" v-loading="loading">
      <h4 class="block-title">专家组列表</h4>
      <div class="block-body">
        <el-row>
          <el-col :span="24">
            <el-table
              :data="tableData"
              stripe
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="50"></el-table-column>
              <el-table-column type="index" :index="indexMethod"></el-table-column>
              <el-table-column prop="account" label="账号" width="150"></el-table-column>
              <el-table-column prop="name" label="姓名" width="150"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column label="操作" width="240"  header-align="center" align="center">
                <template slot-scope="scope">
                  <div class="text-center">
                    <el-button type="default" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="block-bottom">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multipleSelection.length == 0" @click="deleteItem(false)">批量删除</el-button>
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

    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="60%"
      center>
      <el-form :model="expertForm" :rules="rules" ref="expertForm" label-width="150px" size="small">
        <h4 class="block-depart-title">基本信息</h4>
        <el-form-item label="账号" prop="account">
          <span> {{ expertForm.account }} </span>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="expertForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="expertForm.email"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="profession">
          <el-tree
            ref="industryTree"
            :data="industryTree"
            node-key="id"
            :props="treeProps"
            show-checkbox
            @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('expertForm')">提交</el-button>
        <el-button type="default" @click="resetForm('expertForm')">重置</el-button>
      </span>
    </el-dialog>
  </div> 
</template>

<script>
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
        // 模态框
        editDialogVisible: false,
        expertForm: {
          account: null,
          profession: null, //行业数组string
        },
        rules: {
          profession: [
            { required: true, message: '请选择对应行业', trigger: 'change' },
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ]
        },
        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        }
      }
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
       * @return {[type]} [description]
       */
      getTableListData() {
        this.loading = true
        let cofig = {
          method: "get",
          url:    `${this.common.basePath}/hr_users/expert/list`,
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
          self.$message.error(error)
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
       * 点击显示编辑对话框
       * @param  {number} itemId 当前项的Id
       * @return {[type]}        [description]
       */
      showEditDialog (itemId) {
        this.editDialogVisible = true
        this.getDetail(itemId)
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
        self.$confirm("确定提交吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消"
        }).then(_ => {
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
        })
      },
      /**
       * 删除
       * @param  {array} itemId 需要删除的Id数组
       * @return {[type]}         [description]
       */
      deleteItem(itemId) {
        let self = this
        let config = {
          method: "delete",
          url:    `${self.common.basePath}/hr_users/ids/delete`,
          data:   [itemId]
        }
        if(!itemId) {
          config.data = self.multipleSelection.map((item) => {
            return item.id
          })
        }
        self.$confirm("删除后需要重新添加", "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消"
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

<style>
  
</style>