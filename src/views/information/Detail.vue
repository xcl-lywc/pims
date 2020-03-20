 <!--
  项目详情
  -->
<template>
  <div v-loading="formLoading">
    <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" @click="common.backForward()">返回</el-button>
    <h2 class="page-title">
      {{type == 'view' ? '资讯详情' : '编辑资讯'}}
    </h2>
    <div class="block-wrap">
      <h4 class="block-title">{{type == 'view' ? '资讯详情' : '资讯内容表单'}}</h4>
      <div class="block-body no-bottom">
        <!-- 展示型表单添加show-form类 , 其余则不需要 -->
        <!-- 展示型表单时 无需指定label-width 普通表单需要指定宽度 特殊的label可在form-item中自行定义宽度 -->
        <!-- 表单title中 用于分隔的标题中的图标 需添加title-icon类 -->
        <information-form v-if="type== 'edit'" :type="type" :id="id" refName="type == 'view' ? 'viewForm' : 'editForm'"></information-form>
        <div v-else>
          <h3 class="text-center information-title">{{detailData.aName}}</h3>
          <p class="information-content">{{ detailData.aContent }}</p>
          <el-form>
            <el-form-item label="附件列表：">
              <file-list v-if="privateFile && privateFile.length > 0" :fileList="privateFile"></file-list>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import form from "./components/Form.vue"
  import fileList from "@/components/FileList.vue"
  export default {
    data() {
      return {
        formLoading: false,
        //字典及相关内容
        id:     this.$route.params.id, 
        type:   this.$route.params.type, //当前显示模式 view 展示, edit 可编辑
        detailData: {
        },
        privateFile: [],
      }
    },
    components: {      
      "information-form": form,
      "file-list": fileList
    },
    watch: {
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
        if(this.type == "view") {
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
          self.detailData  = response.data.data
          self.privateFile = JSON.parse(response.data.data.privateFile)
					console.log(self.privateFile)
          self.formLoading = false
        })
        .catch((error) => {
          self.$message.error(error)
          self.formLoading = false
        })
      },
      // /*********  文件上传操作回调 *********/
      // getFileList (fileList) {
      //   let list = JSON.parse(JSON.stringify(fileList))
        
      //   return list.map((item, index) => {
      //     if(item.response) {
      //       return {
      //         name: item.name,
      //         path: item.response.data.path,
      //         url:  item.url
      //       }
      //     } else {
      //       return item
      //     }
      //   })
      // },
      // uploadBasisSuccess (response, file, fileList) {
      //   this.fileBasis = this.getFileList(fileList)
      // },
      // uploadPlanSuccess (response, file, fileList) {
      //   this.filePlan = this.getFileList(fileList)
      // },
      // uploadAttachmentSuccess (response, file, fileList) {
      //   this.fileAttachment = this.getFileList(fileList)
      // },
      /*********  文件上传操作回调 *********/
    }
  }
</script>

<style lang="less" scoped>
  .information-title {
    font-size: 20px;
  }
  .information-content {
    margin: 20px 0;
    padding: 0 20px;
  }
</style>