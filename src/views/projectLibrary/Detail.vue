 <!--
  项目详情
  -->
<template>
  <div v-loading="formLoading">
    <h2 class="page-title">
      {{mode == 'view' ? '项目详情' : '编辑项目'}}
    </h2>
    <div class="block-wrap">
      <h4 class="block-title">{{mode == 'view' ? '项目信息' : '项目信息表单'}}</h4>
      <div class="block-body">
        <!-- 展示型表单添加show-form类 , 其余则不需要 -->
        <!-- 展示型表单时 无需指定label-width 普通表单需要指定宽度 特殊的label可在form-item中自行定义宽度 -->
        <!-- 表单title中 用于分隔的标题中的图标 需添加title-icon类 -->
        <el-form
          :model="projectForm"
          :rules="rules"
          ref="projectForm"
          :label-width="mode == 'view' ? null : `150px`"
          :class="mode == 'view' ? `show-form` : ``"
          size="middle">

          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-vcard-o title-icon"></i>基本信息</h4>
            <el-col :span="12">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-if="mode == 'edit'" v-model="projectForm.name"></el-input>
              <span v-else>{{ projectForm.name }}</span>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算负责人："  prop="budget_leader">
               <el-input v-if="mode == 'edit'" v-model="projectForm.budget_leader"></el-input>
              <span v-else>{{ projectForm.budget_leader }}</span>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算联系人：" prop="linkman">
                <el-input v-if="mode == 'edit'" v-model="projectForm.linkman "></el-input>
              <span v-else>{{ projectForm.linkman }}</span>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话："  prop="cellphone">
                <el-input v-if="mode == 'edit'" v-model="projectForm.cellphone"></el-input>
              <span v-else>{{ projectForm.cellphone }}</span>
            </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-database title-icon"></i>预算信息</h4>
           <!--  <el-col :span="12">
              <el-form-item label="行业：" :label-width="mode == 'view' ? `80px` : `150px`" prop="profession">
                <el-tree
                  ref="industryTree"
                  :data="industryTree"
                  node-key="id"
                  :props="treeProps"
                  show-checkbox
                  accordion
                  @check-change="handleCheckChange">
                </el-tree>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="预算单位：" prop="budget_user">
                <el-select v-if="mode == 'edit'" v-model="projectForm.budget_user" class="fill-width">
                  <el-option v-for="(item, index) in userList" :label="item.name" :value="item.id" :key="`用户列表${index}`"></el-option>
                </el-select>
                <span v-else>{{ projectForm.budget_user_name }}</span>
              </el-form-item>
              <el-form-item label="项目总预算：" prop="total">
                <el-input-number v-if="mode == 'edit'" class="fill-width" v-model="projectForm.total" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
                <span v-else>{{ projectForm.total }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请财政资金金额：" prop="application_money">
                <el-input-number v-if="mode == 'edit'" class="fill-width" v-model="projectForm.application_money" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
                <span v-else>{{ projectForm.application_money }}</span>
              </el-form-item>
              <el-form-item label="自筹金额：" prop="raise_money">
                <el-input-number v-if="mode == 'edit'" class="fill-width" v-model="projectForm.raise_money" :precision="2" :step="0.1" controls-position="right" :min="0"></el-input-number>
                  <!-- <template slot="append">万元</template> -->
                <span v-else>{{ projectForm.raise_money }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <h4 class="block-depart-title"><i class="fa fa-list-alt title-icon"></i>立项情况</h4>
            <el-form-item label="预算依据：">
              <el-upload
                v-if="mode == 'edit'"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="token"
                multiple
                :limit="99"
                :on-success="uploadBasisSuccess"
                :file-list="fileBasis">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <file-list v-else :fileList="fileBasis"></file-list>
            </el-form-item>
            <el-form-item label="可行性说明：">
              <el-input v-if="mode == 'edit'" type="textarea" v-model="projectForm.feasibility_statement"></el-input>
              <span v-else>{{ projectForm.feasibility_statement }}</span>
            </el-form-item>
            <el-form-item label="必要性说明：">
              <el-input v-if="mode == 'edit'" type="textarea" v-model="projectForm.necessity_statement "></el-input>
              <span v-else>{{ projectForm.necessity_statement }}</span>
            </el-form-item>
            <el-form-item label="绩效目标：">
              <el-input v-if="mode == 'edit'" type="textarea" v-model="projectForm.target"></el-input>
              <span v-else>{{ projectForm.target }}</span>
            </el-form-item>
          </el-row>

          <el-row :gutter="0">
            <el-col :span="12">
              <h4 class="block-depart-title"><i class="fa fa-book title-icon"></i>实施计划</h4>
              <el-form-item label="起止日期：" prop="plan_begin_time">
                <el-date-picker v-if="mode == 'edit'" type="daterange" placeholder="选择日期" value-format="timestamp" v-model="dateRange"></el-date-picker>
                <span v-else>
                  
                  <span v-if="projectForm.plan_begin_time">{{ common._convertDate(projectForm.plan_begin_time, 'yyyy年MM月dd')}} &nbsp;至&nbsp; {{common._convertDate(projectForm.plan_end_time, 'yyyy年MM月dd')}}</span>
                  <span v-else></span>
                </span>
              </el-form-item>
              <el-form-item label="实施方案：">
                <el-upload
                  v-if="mode == 'edit'"
                  :action="`${common.basePath}/file/-1/uplode`"
                  :headers="token"
                  multiple
                  :limit="99"
                  :on-success="uploadPlanSuccess"
                  :file-list="filePlan">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <file-list v-else :fileList="filePlan"></file-list>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h4 class="block-depart-title"><i class="fa fa-file title-icon"></i>备注说明</h4>
              <el-form-item label="附件材料：">
                <el-upload
                  v-if="mode == 'edit'"
                  :action="`${common.basePath}/file/-1/uplode`"
                  :headers="token"
                  multiple
                  :limit="3"
                  :on-success="uploadAttachmentSuccess"
                  :file-list="fileAttachment">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <file-list v-else :fileList="fileAttachment"></file-list>
              </el-form-item>
            </el-col>
          </el-row>
          
          
          <div class="text-center" v-if="mode == 'edit'">
            <el-button size="middle" type="primary" @click="submitForm('projectForm')">提交</el-button>
            <el-button size="middle" @click="resetForm('projectForm')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import fileList from "@/components/FileList.vue"
  export default {
    data() {
      return {
        formLoading: false,
        //字典及相关内容
        viewMode:     "detail", //当前显示模式 view 展示, edit 可编辑
        userList:     [],
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        },
        token: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        projectForm: {
          additional:           "",
          // "budget_leader": 0,
          budget_user:           null,
          cellphone:             null,
          create_basis:          "",
          creator:               JSON.parse(sessionStorage.getItem("userData")).id,
          cur_status:            1,
          feasibility_statement: null,
          implementation:        "",
          // "linkman":             0,
          name:                  null,
          necessity_statement:   null,
          plan_begin_time:       null,
          plan_end_time:         null,
          profession:            null,
          professionArray:       [],
          raise_money:           null,
          application_money:     null,
          total:                 null,

          target:                null,
        },
        dateRange:      [], // 时间组件选中的组件数据
        fileBasis:      [], //预算依据文件List
        filePlan:       [], //实施方案文件List
        fileAttachment: [], //附件List
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
          budget_user: [
            { required: true, message: '请选择预算单位', trigger: 'change' }
          ]
        },
      }
    },
    props: {
      mode: {
        type: String
      },
      id: {
        type: Number
      }
    },
    components: {
      "file-list": fileList
    },
    watch: {
      dateRange: {
        handler (newV, oldV) {
          this.$refs.projectForm.validateField("plan_begin_time")
        },
        deep: true
      },
      mode: {
        handler (newV, oldV) {
          this.init()
        },
        deep: true
      },
      id: {
        handler (newV, oldV) {
          console.log(newV)
        },
        deep: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.formLoading = true
        // this.common.getDictionaryData(2).then((response) => {
        //   this.industryTree = response
        //   this.formLoading = false
        // })
        this.getDetailData()
        if(this.viewMode == "detail") { //仅在编辑状态下查询
          this.getUserListData()
        }
      },
      getDetailData () {
        let self = this
        self.formLoading = true
        let cofig = {
          method: "get",
          url:    `${self.common.basePath}/budget/${this.id}`,
        }
        self.axios(cofig)
        .then((response) => {
          self.projectForm = response.data.data
          // 设置对应树节点选中
          // if(self.projectForm.profession) { 
          //   self.projectForm.professionArray = self.projectForm.profession.split(',').map((item) => {
          //     return parseInt(item)
          //   })
          //   self.$refs.industryTree.setCheckedKeys(self.projectForm.professionArray)
          // }
          self.dateRange = [self.projectForm.plan_begin_time, self.projectForm.plan_end_time]
          // 展示文件列表
          self.fileBasis      = JSON.parse(response.data.data.create_basis) || []
          self.filePlan       = JSON.parse(response.data.data.implementation) || []
          self.fileAttachment = JSON.parse(response.data.data.additional) || []

          self.formLoading = false
        })
        .catch((error) => {
          self.$message.error(error)
          self.formLoading = false
        })
      },
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
        self.$confirm("确定提交吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消",
          type: 'info',
        }).then(_ => {
          self.$refs[formName].validate((valid) => {
            if (valid) {
              let cofig = {
                method: "patch",
                url:    `${self.common.basePath}/budget/${self.id}`,
                data:   self[formName]
              }
              this.handleForm(formName)

              self.axios(cofig)
              .then((response) => {
                self.$emit('submitSuccess');
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
        if(this.dateRange.length > 0) {
          this[formName].plan_begin_time = this.dateRange[0]
          this[formName].plan_end_time   = this.dateRange[1]
        }
        this[formName].create_basis   = JSON.stringify(this.fileBasis)
        this[formName].implementation = JSON.stringify(this.filePlan)
        this[formName].additional     = JSON.stringify(this.fileAttachment)
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
