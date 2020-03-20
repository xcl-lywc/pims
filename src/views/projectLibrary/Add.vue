 <!--
  新建预算项目
  -->
<template>
  <div v-loading="formLoading">
    <h2 class="page-title">新增项目</h2>
    <div class="block-wrap">
      <h4 class="block-title">项目信息表单</h4>
      <div class="block-body">
        <el-form
          :model="projectForm"
          :rules="rules"
          ref="projectForm"
          label-width="150px"
          size="middle">
          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-vcard-o title-icon"></i>基本信息</h4>
            <el-col :span="12">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="projectForm.name"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算负责人："  prop="budget_leader">
               <el-input v-model="projectForm.budget_leader"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算联系人：" prop="linkman">
                <el-input v-model="projectForm.linkman "></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话："  prop="cellphone">
                <el-input v-model="projectForm.cellphone" type="number"></el-input>
            </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-database title-icon"></i>预算信息</h4>
            <el-col :span="12">
              <!-- <el-form-item label="行业：" label-width="150px" prop="profession">
                <el-tree
                  ref="industryTree"
                  :data="industryTree"
                  node-key="id"
                  :props="treeProps"
                  show-checkbox
                  accordion
                  @check-change="handleCheckChange">
                </el-tree>
              </el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算单位：" prop="budget_user">
                <el-select v-model="projectForm.budget_user" class="fill-width">
                  <el-option v-for="(item, index) in userList" :label="item.name" :value="item.id" :key="`用户列表${index}`"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目总预算：" prop="total">
                <el-input-number class="fill-width" v-model="projectForm.total" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请财政资金金额：" prop="application_money">
                <el-input-number class="fill-width" v-model="projectForm.application_money" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
              </el-form-item>
              <el-form-item label="自筹金额：" prop="raise_money">
                <el-input-number class="fill-width" v-model="projectForm.raise_money" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-list-alt title-icon"></i>立项情况</h4>
            <el-form-item label="预算依据：">
              <el-upload
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="token"
                multiple
                :limit="99"
                :on-success="uploadBasisSuccess"
                :file-list="fileBasis">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="可行性说明：">
              <el-input type="textarea" v-model="projectForm.feasibility_statement"></el-input>
            </el-form-item>
            <el-form-item label="必要性说明：">
              <el-input type="textarea" v-model="projectForm.necessity_statement "></el-input>
            </el-form-item>
            <el-form-item label="绩效目标：">
              <el-input type="textarea" v-model="projectForm.target"></el-input>
            </el-form-item>
          </el-row>

          <el-row :gutter="0">
            <el-col :span="12">
              <h4 class="block-depart-title"><i class="fa fa-book title-icon"></i>实施计划</h4>
              <el-form-item label="起止日期：" prop="plan_begin_time">
                <el-date-picker type="daterange" placeholder="选择日期" value-format="timestamp" v-model="projectForm.dateRange"></el-date-picker>
              </el-form-item>
              <el-form-item label="实施方案：">
                <el-upload
                  :action="`${common.basePath}/file/-1/uplode`"
                  :headers="token"
                  multiple
                  :limit="99"
                  :on-success="uploadPlanSuccess"
                  :file-list="filePlan">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h4 class="block-depart-title"><i class="fa fa-file title-icon"></i>备注说明</h4>
              <el-form-item label="附件材料：">
                <el-upload
                  :action="`${common.basePath}/file/-1/uplode`"
                  :headers="token"
                  multiple
                  :limit="3"
                  :on-success="uploadAttachmentSuccess"
                  :file-list="fileAttachment">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          
          
          <div class="text-center">
            <el-button size="middle" type="primary" @click="submitForm('projectForm')">提交</el-button>
            <el-button size="middle" @click="resetForm('projectForm')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formLoading: false,
        //字典及相关内容
        userList: [],
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        },
        token: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        projectForm: {
          additional:            "", //附件string
          // "budget_leader": 0,
          budget_user:           null,
          cellphone:             null,
          create_basis:          "", //预算依据string
          creator:               JSON.parse(sessionStorage.getItem("userData")).id,
          cur_status:            1,
          feasibility_statement: null,
          implementation:        "", //实施方案string
          // "linkman":             0,
          name:                  null,
          necessity_statement:   null,
          dateRange:             [], //日期组件的字段 提交时删除
          plan_begin_time:       null,
          plan_end_time:         null,
          profession:            null,

          raise_money:           null,
          application_money:     null,
          total:                 null,

          target:                null,
        },
        fileBasis:             [], //预算依据文件List
        filePlan:              [], //实施方案文件List
        fileAttachment:        [], //附件List
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择预算单位', trigger: 'change' }
          ],
          subject: [
            { required: true, message: '请选择预算科目', trigger: 'change' }
          ],
          profession: [
            { required: true, message: '请选择行业', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          budget_user: [
            { required: true, message: '请选择预算单位', trigger: 'change' }
          ]
        },
      }
    },
    mounted () {
      window.c = this
      this.formLoading = true
      this.common.getDictionaryData(2).then((response) => {
        this.industryTree = response
        this.formLoading = false
      })
      this.getUserListData()
    },
    methods: {
      /**
       * 获取全部用户list (用于预算单位)
       * @return {array}  查询返回的树结构
       */
      getUserListData () {
        let self = this
        this.formLoading = true
        let cofig = {
          method: "post",
          url:    `${self.common.basePath}/hr_users/user/list`,
          data: {
            id: 6
          }
        }
        self.axios(cofig)
        .then((response) => {
          self.userList = response.data.data
          this.formLoading = false
        })
        .catch((error) => {
          self.$message.error(error)
          this.formLoading = false
        })
      },
      /**
       * 点击树节点的回调 重写projectForm.profession(数组字符串)
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
        this.projectForm.profession = mapList.join(",")
      },
      /**
       * 提交表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        let self = this
        self.$confirm("确定提交吗?", "确认提交", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消",
          type: 'info',
        }).then(_ => {
          self.$refs[formName].validate((valid) => {
            if (valid) {
              let cofig = {
                method: "post",
                url:    `${self.common.basePath}/budget`,
                data:   self[formName]
              }
              this.handleForm(formName)
              self.axios(cofig)
              .then((response) => {
                self.$router.push({name: "ProjectManagement"})
                self.$message.success(response.data.meta.message)
              })
              .catch((error) => {
                self.$message.error(error)
              })
            } else {
              self.$message.error("请检查表单是否填写正确")
              return false;
            }
          });
        })
      },
      /**
       * 处理表单数据, 用于后台保存
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      handleForm(formName) {
        if(this[formName].dateRange && this[formName].dateRange.length > 0) {
          this[formName].plan_begin_time = this[formName].dateRange[0]
          this[formName].plan_end_time   = this[formName].dateRange[1]
        }

        this[formName].create_basis   = JSON.stringify(this.fileBasis)
        this[formName].implementation = JSON.stringify(this.filePlan)
        this[formName].additional     = JSON.stringify(this.fileAttachment)
        delete this[formName].dateRange
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*********  文件上传操作回调 *********/
      getFileList (fileList) {
        let list = JSON.parse(JSON.stringify(fileList))
        
        return list.map((item, index) => {
          if(item.response) {
            return {
              name: item.name,
              path: item.response.data.path,
              url:  item.url
            }
          } else {
            return item
          }
        })
      },
      uploadBasisSuccess (response, file, fileList) {
        this.fileBasis = this.getFileList(fileList)
      },
      uploadPlanSuccess (response, file, fileList) {
        this.filePlan = this.getFileList(fileList)
      },
      uploadAttachmentSuccess (response, file, fileList) {
        this.fileAttachment = this.getFileList(fileList)
      },
      /*********  文件上传操作回调 *********/
    }
  }
</script>
