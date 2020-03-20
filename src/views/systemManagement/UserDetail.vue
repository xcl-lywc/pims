<template>
	<div v-if="detail">
    <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" @click="$router.push({ path: '/system_management/user' })"> 返回</el-button>
    <h2 class="page-title">用户管理</h2>
    <div class="block-wrap">
      <h4 class="block-title">用户详情
        
      </h4>
      <div class="block-body">
        <el-row>
          <el-col :span="6">
            <img width="120" height="120" :src="`${common.picsBasePath}/${detail.picture}`"/>
          </el-col>
          <el-col :span="18">
            <p class="mar10">账号：{{detail.account}}</p>
            <p class="mar10">姓名：{{detail.name}}</p>
            <p class="mar10">手机：{{detail.phone}}</p>
            <p class="mar10">邮箱：{{detail.email}}</p>
          </el-col>
          <el-col :span="24">
            <p class="mar10">角色列表：<span v-for="(item, index) in detail.roles">{{item.name}}，</span></p>
          </el-col>
          <el-col :span="24">
            <h4 class="block-title"></h4>
            <p class="fr mar10">
              <el-button type="" icon="fa fa-unlock-alt" @click="resetPassClick(detail)"> 重置密码</el-button>
              <el-button type="" icon="el-icon-edit" @click="showDialog('edit',detail)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="delDataClick([detail.id])">删除</el-button>
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 编辑/新增用户 -->
    <el-dialog
      :title="tempOperateType == 'new' ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <div v-loading="loading">
        <el-form :model="form" ref="form" label-width="80px" size="small">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="picture" label-width="0" label="">
                <el-upload
                  class="avatar-wrap avatar-wrap-self"
                  :action="`${common.basePath}/file/-1/uplode`"
                  :headers="token"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  name="file">
                    <img width="100px" height="100px" v-if="form.picture" :src="`${common.picsBasePath}/${form.picture}`">
                    <i v-else class="el-icon-plus avatar-uploader-icon">上传头像</i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item
                prop="account"
                label="账号："
                :rules="[{ required: true, message: '请输入账号', trigger: 'blur' },
                  { validator: validateAccount, trigger:'blur'}]">
                <el-input :disabled="tempOperateType == 'edit' ? true : false" v-model="form.account"></el-input>
              </el-form-item>
              <el-form-item
                v-if="tempOperateType == 'new'"
                prop="password"
                label="密码："
                :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item
                prop="name"
                label="名称："
                :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item
                prop="phoneNum"
                label="手机号："
                :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
                <el-input v-model="form.phoneNum"></el-input>
              </el-form-item>
              <el-form-item
                label="邮箱："
                prop="email"
                :rules="[
                  { required: false, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                prop="roles"
                label="角色列表："
                label-width="100px">
                <el-tag
                  class="marr10"
                  v-for="(itemRole, indexRole) in form.roles"
                  :key="itemRole.name"
                  closable
                  type="info"
                  @close="delRoleDialog(form, indexRole, tempOperateType)">
                  {{itemRole.name}}
                </el-tag>
                <el-button class="" type="" icon="el-icon-circle-plus" size="mini" @click="showRoleDialog(form, tempOperateType)">添加角色</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button :disabled="loading" type="primary" @click="resetForm('form')">重 置</el-button>
      </span>
    </el-dialog>
    <!-- 授予角色 -->
    <el-dialog
      title="授予角色"
      :visible.sync="roleDialogVisible"
      width="30%">
      <el-form :model="roleForm" ref="roleForm" label-width="100px" class="demo-dynamic" size="small">
        <el-form-item
          prop="role"
          label="角色："
          :rules="[{ required: true, message: '请授予角色', trigger: 'blur' },]">
          <el-select v-model="roleForm.role" value-key="id" placeholder="请选择">
            <el-option
              v-for="item in rolesList.rows "
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="resetPassDialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <div v-loading="loading">
        <el-form size="small" class="demo-ruleForm" :rules="resetPasswordFormRules" ref="resetPasswordForm" :model="resetPasswordForm" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="密码：" prop="password"  >
                <el-input type="text" v-model="resetPasswordForm.password"></el-input>
              </el-form-item> 
              </el-col> 
          </el-row> 
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="resetPassDialogVisible = false">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="resetPassword('resetPasswordForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default { 
    methods: {
      getqQueryDetail(){
        this.axios.get(`${this.common.basePath}/hr_users/details`, {params: {id: this.$route.params.id}}).then((reponse) => {
          this.detail = reponse.data.data;
        }).catch((errow) => {

        });
      },
      /*
       * 自定义表单校验
       */
      validateAccount(rule, value, callback) {
        // --- 为编辑状态时，判断原来的数据跟当前输入的数据相同的话，才能操作---
        if(this.tempOperateType =="edit" ? this.tempOPerateData.account != value : true){
          this._validateAccount(value).then( (data) => {
            callback();
          }).catch( (error) => {
            callback(new Error(error));
          });
        }else{
          callback();
        }
        
      },
      uploadSuccess(res){
        if(res.meta.code == 0){
          this.form.picture = res.data.path;
        }
      },
      /*
       * 显示重置密码弹框
       */
      resetPassClick(userData){
        this.resetPassDialogVisible = true;
        this.resetPasswordForm.userId = userData.id;
        this.$refs.resetPasswordForm ? this.$refs.resetPasswordForm.resetFields() : '';
      },
      /*
       * 重置密码
       */
      resetPassword(formName){
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/hr_users/pwd/reset`, this.resetPasswordForm).then( (response) => {
               this.$message.success(response.data.meta.message);  
            }).catch( (error) => {
              this.$message.error(error);            
            });
            this.resetPassDialogVisible = false;
          } else {
            return false;
          }
        });
      },
      /*
       * 删除角色
       * @params {object} userData 当前被操作用户数据
       * @params {string} roleId 当前需要被删除的角色Id
       */
      delRoleDialog(userData, roleId){
        this.axios.delete(`${this.common.basePath}/user_roles/${roleId}`,).then( (response) => {
            this.getQueryRolesListByUserId(userData.id).then( (data) => {
              userData.roles = data;
            }).catch( (error) => {
              this.$message.error(error)
            });
            this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      /*
       * 显示编辑/新增弹框
       * @params {string} type 类别
       * @params {object} celData 数据
       */
      showDialog(type, celData){
        this.$refs.form ? this.$refs.form.resetFields() : '';
        this.dialogVisible = true;
        this.tempOperateType = type;
        if(type == 'edit'){
          this.getQueryUserDetailById(celData.id)
        }
      },
      /*
       * 根据Id查询用户详情
       */
      getQueryUserDetailById(id){
        this.loading = true;
        this.axios.get(`${this.common.basePath}/hr_users/details`, {params: {"id": id}} ).then( (response) => {
           this.form = this.tempOPerateData = response.data.data;
           this.loading = false;
        }).catch( (error) => {
          this.loading = false;
          this.$message.error(error);
        });
       },
      /*
       * 删除指定用户数据
       */
      delDataClick(idArray){
        this.$confirm('确认要删除吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
        .then(() => {
          this.axios.delete(`${this.common.basePath}/hr_users/ids/delete`, { data: idArray }).then( (response) => {
             this.$router.push({ path: '/system_management/user' })
          }).catch( (error) => {
            this.$message.error(error);
          });
        })
        .catch(action => {
           
        });
       },
      /*
       * 显示新增角色弹框
       * @params {string} type  new为在新增弹框中进行操作，edit为编辑弹框中进行操作，cell在列表中进行操作
       */
      showRoleDialog(userData, type){
        this.roleDialogVisible = true;
        this.$refs.roleForm ? this.$refs.roleForm.resetFields() : '';
        this.roleForm.user_id = userData.id;
        if(type == 'cell'){ 
          this.tempOPerateData = userData;
        }
        this.tempOperateType = type;
      },
      /*
       * 提交角色
       */
      submitRoleForm(formName){
        if(!this._validateRoleIsExist()) {
          this.$message.error('已存在此角色，请重新选择！');
          return false;
        };

        if(this.tempOperateType == 'new' || this.tempOperateType == 'edit'){
          this.form.roles.push(this.roleForm.role);
          this.roleDialogVisible = false;
        }
      },
      /*
       * 验证当前被选中的角色数据是否在当前用户信息已经存在
       * @return {boolean} bool  true为通过验证，false则为不通过
       */
      _validateRoleIsExist(){
        let bool = true;
        this.tempOPerateData.roles.forEach( (item) => {
          // ------- 编辑和新增的时候判断的是角色Id
          if(this.tempOperateType == 'edit' || this.tempOperateType == 'new'){
            if(this.roleForm.role.id == item.id) bool = false;
          }else{
            if(this.roleForm.role.id == item.roleId) bool = false;
          }
        });
        return bool;
      },
      /*
       * 查询所有的角色
       */
      getQueryRoleList(){
        this.axios.get(`${this.common.basePath}/roles/list`, '' ).then( (response) => {
           this.rolesList = response.data.data; 
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      /*
       * 提交表单数据
       */
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tempOperateType == 'new' ? this._addForm() : this._editForm();
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
       }, 
      _editForm(){
        this.axios.patch(`${this.common.basePath}/hr_users/user/update/${this.form.id}`, this.form ).then( (response) => {
           this.getqQueryDetail();
           this.$message.success(response.data.meta.message)  
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      resetForm(formName){ 
        if(this.tempOperateType == 'edit'){
          // --- 在编辑时账号是被禁用的，所以不需要重置账号 --  
          let oldForm = JSON.parse(JSON.stringify(this.form));
          this.$refs[formName].resetFields();
          this.form.account = oldForm.account;
        } 
      }
    },
    mounted() { 
      this.getQueryRoleList();
      this.getqQueryDetail();
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        detail: null,
        dialogVisible:          false,
        roleDialogVisible:      false,
        resetPassDialogVisible: false,
        tempOperateType:    'new',// new为新增，edit为编辑
        token:     { "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`},
        form: {
          "account":    null,
          "curStatus":  0,
          "email":      null,
          "name":       null,
          "picture":    null,
          "phoneNum":   null,
          "roles":      [],
        },
        tempOPerateData: null, //被选中的用户数据
        roleForm: {
          "role_id": null,
          "user_id": null,
        },
        rolesList: {rows: [], total: 0}, //所有角色列表
        resetPasswordForm: {
          "password":        null,
          "userId":          null,
        },
        resetPasswordFormRules: {
          password: [
            { required: true, message: '请输入密码'},
            { validator: validatePass, trigger: 'blur' }
          ],
        }, 
      }
    }
  }
</script> 