/***********新增资讯*************/
/* date:   2018/11/05
/* author: zoomze
/********************************/
<template>
  <div v-loading="formLoading">
    <h2 class="page-title">新增资讯</h2>
    <div class="block-wrap">
      <h4 class="block-title">信息表单</h4>
      <div class="block-body">
        <information-form type="new" refName="addForm"></information-form>
      </div>
    </div>
  </div>
</template>

<script>
  import form from "./components/Form.vue"
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
    components: {
      "information-form": form
    },
    mounted () {
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