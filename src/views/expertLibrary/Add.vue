 <!--
  新增专家
  -->
<template>
  <div>
    <h2 class="page-title">新增专家</h2>
    <div class="block-wrap">
      <h4 class="block-title">专家信息表单</h4>
      <div class="block-body">
        <el-form v-loading="formLoading" :model="expertForm" :rules="rules" ref="expertForm" label-width="150px" size="middle">
          <h4 class="block-depart-title"><i class="fa fa-vcard-o title-icon"></i>基本信息</h4>
          <el-form-item label="头像：" prop="picture">
            <el-upload
                class="upload-picture"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="token"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                name="file">
              <img v-if="expertForm.picture" :src="`${common.picsBasePath}/${expertForm.picture}`" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input v-model="expertForm.account" @blur="validateAccount"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="expertForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="expertForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="expertForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="phoneNum">
            <el-input-number :min="0" :controls="false" v-model="expertForm.phoneNum" class="fill-width text-left"></el-input-number>
          </el-form-item>
          <el-form-item label="行业：" prop="profession">
            <el-tree
              ref="industryTree"
              :data="industryTree"
              :props="treeProps"
              show-checkbox
              accordion
              @check-change="handleCheckChange">
            </el-tree>
          </el-form-item>
          <el-form-item label="工作单位：" prop="workUnit">
            <el-input v-model="expertForm.workUnit"></el-input>
          </el-form-item>
          <el-form-item label="职称：" prop="technicalTitle">
            <el-input v-model="expertForm.technicalTitle"></el-input>
          </el-form-item>
          <el-form-item label="是否常用：" prop="commUsed">
            <el-switch v-model="expertForm.commUsed" :active-value="1" :inactive-value="2"></el-switch>
          </el-form-item>
          <div class="text-center">
            <el-button type="primary" size="normal" @click="submitForm('expertForm')">提交</el-button>
            <el-button type="default" size="normal" @click="resetForm('expertForm')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let self = this
      //验证账号是否存在
      var checkAccount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        } else {
          self.validateAccount()
          .then(() => {
            callback();
          })
          .catch((error) => {
            callback(new Error(error));
          })
        }
      };
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
      // 验证手机格式
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        } else {
          if(self.common.mobileReg.test(value)){
            return callback();
          } else {
            return callback(new Error('请输入正确的手机号码'));
          }
        }
      };
      return {
        formLoading: false,
        expertForm: {
          account: null,
          profession: null,
          picture: "",
          commUsed:  1,
        },
        token: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'change' },
            { validator: checkAccount, trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
          ],
          profession: [
            { required: true, message: '请选择对应行业', trigger: 'change' },
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          phoneNum: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        },

        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        }
      };
    },
    watch: {
      'expertForm.account' :{
        handler (newV, oldV) {
          if(!newV) {
            
          }
        },
        deep: true
      }
    },
    mounted () {
      this.common.getDictionaryData(2).then((response) => {
        this.industryTree = response
      })
    },
    methods: {
      /**
       * 获取字典
       * @param  {number} name   字典表id
       * @param  {string} target 数据存放位置
       * @return none
       */
      getDictionaryData (id, target) {
        let self = this
        let cofig = {
          method: "get",
          url:    `${this.common.basePath}/contrast/all/tree`,
          params: {
            typeId: id
          }
        }
        this.axios(cofig)
        .then((response) => {
          let treeData = JSON.parse(JSON.stringify(response.data.data))

          treeData.forEach((item, index) => { //删除空白childrens字段
            self.common.traverseTree(item)
          })

          self[target] = treeData
        })
        .catch((error) => {
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
       * 提交表单
       * @param  {string} formName 表单名ref
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        let self = this
        self.$confirm("确定提交吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消",
          type: 'info',
        }).then(_ => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let cofig = {
                method: "post",
                url:    `${this.common.basePath}/hr_users/expert/add`,
                data:   this.expertForm
              }
              this.axios(cofig)
              .then((response) => {
                self.$message.success(response.data.meta.message)
                self.$router.push({name: "ExpertManagement"})
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
       * 重置表单
       * @param  {string} formName 表单名ref
       * @return {[type]}          [description]
       */
      resetForm(formName) {
        console.log(this[forName])
        this.$refs[formName].resetFields();
      },
      /* 
        上传文件 ---限制用户上传的图片格式和大小
       */
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        this.formLoading = true

        if (!isJPG&&!isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
          this.formLoading = false
        }
        return isJPG || isPNG;
      },
      /* 
        上传文件 ---文件上传成功时
      */
      uploadSuccess(res, file) {
        this.expertForm.picture = res.data.path;
        this.formLoading = false
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      /* 
        上传文件 ---文件上传失败时
      */
      uploadError(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.formLoading = false
        // this.uploadForm.file1 = []
      },
    }
  }
</script>
