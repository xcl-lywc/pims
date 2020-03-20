 <!--角色管理-->
<template>
  <div>
    <h2 class="page-title">角色管理</h2>
    <div class="block-wrap">
      <el-form size="middle" label-width="60px" inline class="pad10">
        <el-form-item label="角色：" prop="name" class="marb0" label-width='80px'>
          <el-select class="fl width-minus-200" @change="typeChange" size="middle" v-model="activeTypeId" placeholder="请选择">
            <el-option
              v-for="item in rolesList.rows"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="marb0">
         <el-button class="fl" type="" icon="el-icon-circle-plus" size="middle" @click="showDialog('addParent')">添加</el-button>
        </el-form-item>
      </el-form> 
      <el-card class="box-card">
        <el-button type="primary" class="width-absolutely" size="middle" @click="saveResource">保存资源</el-button>
        <el-checkbox-group class="my-tree-bar" v-model="checkedResourceValue">
          <tree-selected-loop :treeData="eachTypeAllTree" layer="1"></tree-selected-loop>
        </el-checkbox-group>
      </el-card>
    </div>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="roleForm" ref="roleForm" label-width="100px" class="demo-dynamic" size="middle">
        <el-form-item
          prop="name"
          label="名称："
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm('roleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div> 
</template>

<script>
  import Tree_Selected_Loop  from './roleCompoents/Tree_Selected_Loop.vue'
  export default {
    components:{
      'tree-selected-loop': Tree_Selected_Loop,
    },
    mounted() {
      this.getQueryRoleList();
    },
    data() {
      return {
        dialogVisible:   false, 
        elementPageData: {               //分页需要的数据
            defaultData:  this.common.elementPagination,
            pageNum:      this.common.elementPagination.pageNumDefault,
            pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        tableData:         {rows: [], total: 0},
        rolesList:         {rows: [], total: 0}, //角色管理
        multipleSelection: [],  //选项Id数组
        typeList:          [],  //类型列表
        eachTypeAllTree:   null,//资源树
        activeTypeId:      null,
        roleForm: {
          "name": null
        },
        defaultProps:   {
          children: 'childrens',
          label: 'name'
        },
        addType:              null, //addParent传可选择的typeId，addChild传默认的typeId
        checkedResourceValue: [], //被选中的资源数组
        countLayer:    0,
      }
    },
    methods: {
      /*
       * 根据类别Id查询它的子节点
       */
      getQueryRoleList(){
        this.axios.get(`${this.common.basePath}/roles/list`, '' ).then( (response) => {
           this.rolesList = response.data.data;
           this.rolesList ? this.activeTypeId = this.rolesList.rows[0].id : '';
           this.getQueryTree();
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      
      showDialog(){
        this.dialogVisible = true;
        this.$refs.roleForm ? this.$refs.roleForm.resetFields() : '';
      },
      saveResource(){
        this.axios.post(`${this.common.basePath}/role_resources/batch/update/${this.activeTypeId}`, this.checkedResourceValue).then( (response) => {
          this.getQueryTree();
          this.$message.success(`${response.data.meta.message}, 重新登录后生效`);
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      /*
       * 根据类别Id查询它的子节点
       */
      getQueryTree(){
        // ---- 清空被选中的数据
        this.checkedResourceValue = [];
        this.axios.get(`${this.common.basePath}/role_resources/select/tree`, this._queryTreeParams()).then( (response) => {
           this.eachTypeAllTree = this._convertData(response.data.data);
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _queryTreeParams(){
        return {
          params: {
            roleId:     this.activeTypeId, 
          }
        }
      },
      _convertData(data){
        this.countLayer++;
        data.forEach((item) => {
          this.countLayer == 1 ? item.isShow = false : item.isShow = false;
          if(item.childrens) this._convertData(item.childrens); 
          if(!item.childrens.length) {
            if(item.isSelect) this.checkedResourceValue.push(item.id);
          }
        })
        return data;
      },
      /*
       * 改变角色重插权限树
       */
      typeChange(){
        this.getQueryTree();
      },
      /*
       * 提交角色
       */
      submitRoleForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._add();
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      /*
       * 添加角色
       */
      _add(){
        this.axios.post(`${this.common.basePath}/roles/roles/add`,this.roleForm).then( (response) => {
           this.getQueryRoleList();
           this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
    },
  }
</script>
<style type="text/css">
  .label-dic{
    line-height: 30px;
    font-size: 14px;
    color: #909399;
  }
  .width-minus-100{
    width: calc(100% - 100px)!important;
  }
  .mart30{
    margin-top: 30px!important;
  }
  .my_custom-tree-node{
    width: 100%;
  }
  .my_custom-tree-node .tree-right-operate{
    margin-left: 130px;  
  }
  .width-minus-200{
    width: calc(100%);
  }
  .width-absolutely{
    width: 100%;
  }

</style>