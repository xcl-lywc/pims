   <!--
    用户管理
  -->
<template>
  <div>
    <h2 class="page-title">用户管理</h2>
    <div class="block-wrap">
      <h4 class="block-title">用户管理</h4>
      <div class="block-body">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="" icon="el-icon-circle-plus" size="middle" @click="showDialog('new', form)">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="middle" @click="delDataClick(multipleSelection)">批量删除</el-button>
          </el-col>
          <el-col :span="6" :offset="12">
            <el-button type="" icon="el-icon-search" size="middle" class="fr" @click="searchClick">检索</el-button>
            <el-input size="middle" v-model="searchText" placeholder="根据姓名或账号检索" class="fr width-minus-100"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <div style="height: 10px;"></div>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table 
              :data="tableData.rows" stripe 
              @selection-change="handleSelectionChange"
              @row-click="cellClick" >
              <el-table-column fixed type="selection" width="50"></el-table-column>
              <el-table-column type="index" :index="indexMethod" width="60" label="序号" class-name="border-index"></el-table-column>
              <el-table-column prop="account" label="账号" width="150"></el-table-column>
              <el-table-column prop="name" label="姓名" width="150"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="240"></el-table-column>
              <el-table-column prop="roles" label="角色" min-width="250">
                <template slot-scope="scope">
                  <div class="roles-list-box">
                    <div class="tag-div">
                      <el-tag
                        class="marr10"
                        v-for="(itemRole, indexRole) in scope.row.roles"
                        :key="indexRole"
                        closable
                        type="info"
                        @close="delRoleDialog(scope.row, itemRole.id, 'cell')">
                        {{itemRole.name}}
                      </el-tag>
                    </div>
                    
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作"  width="420" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button type="success" icon="el-icon-circle-plus" size="small" @click="showRoleDialog(scope.row,'cell')">添加角色</el-button>
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="showDialog('edit',scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="delDataClick([scope.row.id])">删除</el-button>
                  <el-button type="primary" icon="fa fa-unlock-alt" size="small" @click="resetPassClick(scope.row)"> 重置密码</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
      <div class="block-bottom"> 
        <el-pagination :span="24" class="ce-pagination"
         @size-change="handleSizeChange($event)"
         @current-change="handleCurrentChange($event)"
         :current-page="elementPageData.pageNum"
         :page-sizes="elementPageData.defaultData.pageSizes"
         :page-size="elementPageData.defaultData.pageSizeDefault"
         background
         middle
         layout="total, sizes, prev, pager, next, jumper"
         :total="tableData.total">
        </el-pagination> 
      </div>
    </div>
    <!-- 编辑/新增用户 -->
    <el-dialog
      :title="tempOperateType == 'new' ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <div v-loading="loading">
        <el-form :model="form" ref="form" label-width="80px" size="middle">
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
      <el-form :model="roleForm" ref="roleForm" label-width="100px" class="demo-dynamic" size="middle">
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
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPassDialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <div v-loading="loading">
        <el-form size="middle" class="demo-ruleForm" :rules="resetPasswordFormRules" ref="resetPasswordForm" :model="resetPasswordForm" label-width="80px">
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
      /*
       * 根据条件查询用户列表
       */
      getQueryList(){
        this.axios.get(`${this.common.basePath}/hr_users/choice/list`, this._queryListParams() ).then( (response) => {
          // this.tableData = this._toUserDataAddRolesList(response.data.data);
          this.tableData = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
       },
      _queryListParams(){
        return {
          params: {
            name:       this.searchText,
            pageNum:    this.elementPageData.pageNum,
            pageSize:   this.elementPageData.pageSize,
          }
        }
       },
       /*
        * 在用户信息中添加角色列表数据
        */
      _toUserDataAddRolesList(userData){
        userData.rows.forEach((item) => {
          item.roles = [];  //现将键给加上，避免后面的赋值页面不能识别
          this.getQueryRolesListByUserId(item.id).then( (data) => {
            item.roles = data;
          }).catch( (error) => {
            this.$message.error(error)
          });
        });

        return userData;
      },
      indexMethod(index) {
        return index * 1;
       },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
        this.elementPageData.pageNum = val;
        this.getQueryList();
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){
        this.elementPageData.pageSize = val;
        this.getQueryList();
       },
      /*
       * 检索数据
       */
      searchClick(){
        this.getQueryList();
       },
      /*
       * 获取表单中被选中的列的id数组
       */
      handleSelectionChange(val){
        this.multipleSelection = [];
        val.forEach((item) => {
          this.multipleSelection.push(item.id)
        })
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
             this.getQueryList();
          }).catch( (error) => {
            this.$message.error(error);
          });
        })
        .catch(action => {
           
        });
        
       },
      uploadSuccess(res){
        if(res.meta.code == 0){
          this.form.picture = res.data.path;
        }
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
      _addForm(){
        this.axios.post(`${this.common.basePath}/hr_users/user/add`, this.form ).then( (response) => {
          this.getQueryList();       
          this.$message.success(response.data.meta.message)    
        }).catch( (error) => {
          this.$message.error(error);
        });
       },
      _editForm(){
        this.axios.patch(`${this.common.basePath}/hr_users/user/update/${this.form.id}`, this.form ).then( (response) => {
           this.getQueryList();
           this.$message.success(response.data.meta.message)  
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
      /*
       * 验证账号是否重复
       */
      _validateAccount(account){
        return new Promise( (resolve, reject) => {
          this.axios.get(`${this.common.basePath}/hr_users/judge`, {params: {"account": account}} ).then( (response) => {
             resolve(response)
          }).catch( (error) => {
            reject(error);
          });
        });
       },
      /*
       * 根据用户Id查询角色列表
       */
      getQueryRolesListByUserId(userId){
        return new Promise( (resolve, reject) => {
          this.axios.get(`${this.common.basePath}/user_roles/roles`, { params: {'userId': userId} } ).then( (response) => {
            resolve(response.data.data);
          }).catch( (error) => {
            reject(error);
          });
        });
        
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
       * 显示新增角色弹框
       * @params {string} type  new为在新增弹框中进行操作，edit为编辑弹框中进行操作，cell在列表中进行操作
       */
      showRoleDialog(userData, type){
        this.roleDialogVisible = true;
        this.$refs.roleForm ? this.$refs.roleForm.resetFields() : '';
        this.roleForm.user_id = userData.id;
        if(type == 'cell'){ //表格类型就改当前行数据
          this.tempOPerateData = userData;
        }else { //编辑新增类型就改当前表单数据
          this.tempOPerateData = this.form;
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
        }else{
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this._addRole();
              this.roleDialogVisible = false;
            } else {
              return false;   
            }
          });
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
       * 添加角色
       */
      _addRole(){
        // ---------- 由于角色选中的角色是对象，所以现在需要单独赋值一个角色Id
        this.roleForm.role_id = this.roleForm.role.id;

        // ---------- 保存角色数据 ---------------- 
        this.axios.post(`${this.common.basePath}/user_roles`,this.roleForm).then( (response) => {
            this.getQueryRolesListByUserId(this.tempOPerateData.id).then( (data) => {
              this.tempOPerateData.roles = data;
            }).catch( (error) => {
              this.$message.error(error)
            });
            this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      /*
       * 删除角色
       * @params {object} userData 当前被操作用户数据
       * @params {string} roleId type为'new'时，roleId返回的是下标，否则返回的是需要被删除的角色Id
       * @params {string} type  new为在新增弹框中进行操作，edit为编辑弹框中进行操作，cell在列表中进行操作
       */
      delRoleDialog(userData, roleId, type){
        if(type == 'new'){
          userData.roles.splice(roleId,1); //直接删除数据，不跟数据库做操作，等新增数据填写完成后一起保存
        }else{
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
       * 点击跳转详情页面
       */
      cellClick(row, column, cell){
        if(cell.property == 'account' || cell.property == 'name' || cell.property == 'email'){
          this.$router.push({name: 'SystemUserDetail', params: { id: row.id}})
        }
      },
      resetForm(formName){
        if(this.tempOperateType == 'edit'){
          // --- 在编辑时账号是被禁用的，所以不需要重置账号 --  
          let oldForm = JSON.parse(JSON.stringify(this.form));
          this.$refs[formName].resetFields();
          this.form.account = oldForm.account;
        }else{
          this.$refs[formName].resetFields();
        }
      }
    },
    mounted() {
      this.getQueryRoleList();
      this.getQueryList();
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
        loading:                false,
        dialogVisible:          false,
        roleDialogVisible:      false,
        resetPassDialogVisible: false,
        elementPageData: {               //分页需要的数据
            defaultData:  this.common.elementPagination,
            pageNum:      this.common.elementPagination.pageNumDefault,
            pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        token:     { "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`},
        tableData: {rows: [], total: 0}, 
        searchText:         null, // 搜索词
        multipleSelection:  null, // 表格选中的Id数组列
        tempOperateType:    'new',// new为新增，edit为编辑
        rolesList: {rows: [], total: 0}, //所有角色列表
        form: {
          "account":    null,
          "curStatus":  0,
          "email":      null,
          "name":       null,
          "picture":    null,
          "phoneNum":   null,
          "roles":      [],
        },
        roleForm: {
          "role": null,
          "user_id": null,
        },
        tempOPerateData: null, //被选中的用户数据
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

<style lang="less">
  .roles-list-box{
    display: flex;
    .tag-div{
      width: calc(100% - 140px);
      margin-right: 10px;
    }
    .tag-div>span{
      margin-bottom: 5px;
    }
    .add-height{
      height: 40px;
    }
  }
</style>