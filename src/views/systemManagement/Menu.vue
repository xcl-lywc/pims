 <!--菜单管理-->
<template>
  <div>
    <h2 class="page-title">菜单管理</h2>
    <div class="block-wrap">
      <el-row :gutter="20" class="pad10">
        <el-col :span="6">
          <el-button type="" icon="el-icon-circle-plus" size="middle" @click="showDialog('addParent')">添加</el-button>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <el-tree
          :data="eachTypeAllTree"
          node-key="id"
					accordion
          :props="defaultProps"
          :expand-on-click-node="false">
          <span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
            <span>{{ node.label }}</span>
            <span v-if="tempAtId == data.id" class="tree-right-operate">
              <el-button
                type="primary"
                size="mini"
                @click="showDialog('addChild', data)">
                添加子菜单
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="showDialog('edit', data)">
                编辑菜单
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="del(data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
    </div>
    <!-- 编辑/添加菜单 -->
    <el-dialog
      :title=" activeTypeDialog == 'add' ? '添加菜单': '编辑菜单' "
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic" size="middle">
        <el-form-item
          prop="name"
          label="名称："
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          prop="url"
          label="地址："
          :rules="[{ required: true, message: '请输入地址', trigger: 'blur' },]">
          <el-input v-model="form.url"></el-input>
        </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div> 
</template>

<script>
  export default {
    mounted() {
      this.getQueryTree();
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
        multipleSelection: [],  //选项Id数组
        typeList:          [],  //类型列表
        form: {
          "code":       null,
          "creator":    JSON.parse(sessionStorage.getItem('userData')).id,
          "cur_status": 0,
          "name":       null,
          "parent_id":  null,
          "type":       1,
          "url":        null,
        },
        activeTypeDialog:     'add', //add为新增，edit为编辑
        activeTypeId:         null,  //类型Id
        searchText:           null,  //检索信息
        itemActiveJurisdiction:  null,  //当前被编辑的菜单数据
        eachTypeAllTree:      null,  //根据类别获取类别下面的子节点
        defaultProps:   {
          children: 'childrens',
          label: 'name'
        },
        tempAtId:             null, //当前浮动选中的属性节点Id
        addType:              null, //addParent传可选择的typeId，addChild传默认的typeId
      }
    },
    methods: {
      /*
       * 根据类别Id查询它的子节点
       */
      getQueryTree(){
        this.axios.get(`${this.common.basePath}/resources/tree`, this._queryTreeParams() ).then( (response) => {
           this.eachTypeAllTree = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _queryTreeParams(){
        return {
          params: {
            type:     1, // 1是前端栏目菜单，2是后台菜单
          }
        }
      },
      /*
       * 根据Id删除菜单,curStatus为20表示伪删除
       */
      del(data){
        data.curStatus = '20';
        this.axios.patch(`${this.common.basePath}/resources/delete/${data.id}`, data).then( (response) => {
           this.getQueryTree();
           this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      handleSelectionChange(val){
        let idS = [];
        val.forEach((item, index) => {
          idS.push(item.id);
        });
        this.multipleSelection = idS;
      },
      /*
       * 显示添加/编辑框
       * @params {string} type 
       * @params {object} item type为edit是需要，
       */
      showDialog(type, item){
        this.$refs.form ? this.$refs.form.resetFields() : '';
        
        this.addType = type;
        if(type == 'addParent' || type == 'addChild'){
          // ---- 这样设置一个初始值，避免编辑时赋的值给误导添加
          this.form = {
            "code":       null,
            "creator":    JSON.parse(sessionStorage.getItem('userData')).id,
            "cur_status": 0,
            "name":       null,
            "parent_id":  null,
            "type":       1,
            "url":        null,
          };

          this.dialogVisible = true;
          this.activeTypeDialog = 'add';

          if(type == 'addChild'){ //添加子节点，就需要把父节点的Id传入
            this.form.parent_id = item.id;
          }
          
        }else{
          this.dialogVisible = true;
          this.activeTypeDialog = 'edit';
          this.form = JSON.parse(JSON.stringify(item));
        }
      },
      
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.activeTypeDialog == 'add' ? this._addJurisdiction() : this._editJurisdiction();
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      /*
       * 添加菜单
       */
      _addJurisdiction(){
        this.axios.post(`${this.common.basePath}/resources`,this.form).then( (response) => {
           this.getQueryTree();
           this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      /*
       * 编辑菜单
       */
      _editJurisdiction(item){
        this.form.curStatus = 0;
        this.axios.patch(`${this.common.basePath}/resources/${this.form.id}`,this.form).then( (response) => {
           this.getQueryTree();
           this.$message.success(response.data.meta.message);
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      typeChange(){
        this.getQueryTree();
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

</style>