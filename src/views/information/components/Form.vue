/***********资讯表单*************/
/* date:   2018/11/05
/* author: zoomze
/* 包含(新增/编辑/详情)三种不同情况的使用
/* props: {
  type: "new" || "edit" || "view",
  id: xxx,
}
/********************************/
<template>
  <el-form
    :model="informationForm"
    :rules="rules"
    :ref="refName"
    label-width="150px"
    :class="type == 'view' ? `show-form` : ``"
    size="middle">
    <el-row :gutter="0">
      <h4 class="block-depart-title"><i class="fa fa-vcard-o title-icon"></i>基本信息</h4>
      <el-col :span="24">
        <el-form-item label="标题：" prop="aName">
          <el-input v-if="type != 'view'" v-model="informationForm.aName" ></el-input>
          <span v-else>{{ informationForm.aName }}</span>
				</el-form-item>
      </el-col>
			<el-col :span="24">
				<el-form-item label="链接：" prop="aCover">
					<el-input v-if="type != 'view'" v-model="informationForm.aCover" ></el-input>
					<span v-else>{{ informationForm.aCover }}</span>
				</el-form-item>
			</el-col>
      <el-col :span="24">
        <el-form-item label="简介："  prop="aContent">
         <el-input v-model="informationForm.aContent" type="textarea" :rows="10" v-if="type != 'view'"></el-input>
         <span v-else>{{ informationForm.aContent }}</span>
      </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="0">
      <el-col :span="24">
        <h4 class="block-depart-title"><i class="fa fa-file title-icon"></i>其他信息</h4>
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

    <el-row :gutter="0">
      <h4 class="block-depart-title"><i class="fa fa-database title-icon"></i>行业分类</h4>
      <el-col :span="24">
        <el-form-item label="分类：" label-width="150px" prop="atTypes">
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
      </el-col>
    </el-row>
    <div class="text-center" v-if="type != 'view'">
      <el-button size="middle" type="primary" @click="submitForm('informationForm')">提交</el-button>
      <el-button size="middle" @click="resetForm('informationForm')">重置</el-button>
    </div>
  </el-form>
</template>

<script>
  import fileList from "@/components/FileList.vue"
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
        informationForm: {
          privateFile: "", //附件string
          aName:       null,
					aCover:        null,
          aContent:    null,
          atTypes:     null,
        },
        fileAttachment:        [], //附件List
        rules: {
          aName: [
            { required: true, message: '请输入资讯标题', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
          ],
          aContent: [
            { required: true, message: '请输入资讯内容', trigger: 'change' }
          ],
          atTypes: [
            { required: true, message: '请选择分类', trigger: 'change' }
          ],
        },
      }
    },
    props: {
      type: {
        required: true,
        type: String
      },
      id: {
        type: Number,
      },
      refName: {
        required: true,
        type: String
      },
    },
    components: {
      "file-list": fileList,
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.formLoading = true
        this.common.getDictionaryData(6).then((response) => {
          this.industryTree = response
          this.formLoading = false
        })
        if(this.type != "new") { //新增状态不查询详情
          this.getDetailData()
        }
      },
      getDetailData () {
        let self = this
        self.formLoading = true
        let cofig = {
          method: "post",
          url:    `${self.common.basePath}/a_info/detail/${this.id}`,
        }
        console.log(this.id)
        self.axios(cofig)
        .then((response) => {
          self.informationForm = response.data.data
          // 设置对应树节点选中
          self.$refs.industryTree.setCheckedKeys(self.informationForm.atTypesVo.map((item) => {
            return item.id
          }))
          // 展示文件列表
          self.fileAttachment = JSON.parse(response.data.data.privateFile) || []
          self.formLoading = false
        })
        .catch((error) => {
          self.$message.error(error)
          self.formLoading = false
        })
      },
      /**
       * 点击树节点的回调 重写informationForm.atTypes(数组字符串)
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
        this.informationForm.atTypes = mapList
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
          self.$refs[this.refName].validate((valid) => {
            if (valid) {
              let cofig = {
                method: self.type == "new" ? "post" : "put",
                url:    self.type == "new" ? `${self.common.basePath}/a_info/add` : `${self.common.basePath}/a_info/update/${self.id}`,
                data:   self[formName]
              }
              this.handleForm(formName)
              self.axios(cofig)
              .then((response) => {
                self.$router.push({name: "InformationManagement"})
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
        this[formName].privateFile = JSON.stringify(this.fileAttachment)
      },
      resetForm(formName) {
        
        this.fileAttachment = []
        this.$refs[this.refName].resetFields();
        this.$refs.industryTree.setCheckedNodes([]) 
        this.$nextTick(() => { //等待 setCheckedNodes() 结束渲染
          this[formName].atTypes = null //清空tree中的选中 同时清空用于保存的数据字段
          this.$refs[this.refName].clearValidate();
        })
        
        this.$message.success("已清空")
      },
      /*********  文件上传操作回调 *********/
      uploadAttachmentSuccess (response, file, fileList) {
        this.fileAttachment = this.getFileList(fileList)
      },
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
      /*********  文件上传操作回调 *********/
    }
  }
</script>