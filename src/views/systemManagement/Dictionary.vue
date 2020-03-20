 <!--字典管理-->
<template>
  <div>
    <h2 class="page-title">字典管理</h2>
    <div class="block-wrap">
      <el-row :gutter="20" class="pad10">
        <el-col :span="6">
          <el-button type="" icon="el-icon-circle-plus" size="middle" @click="showDialog('addParent')">添加</el-button>
        </el-col>
        <el-col :span="18">
          <el-form size="middle" label-width="100px" inline class="fr">
            <el-form-item label="类型：" prop="name" class="marb0">
              <el-select class="fl" @change="typeChange" size="middle" v-model="activeTypeId" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
             <!-- <el-button class="fl" type="" icon="el-icon-circle-plus" size="middle" @click="showDialog('addParent')">添加</el-button> -->
            </el-form-item>
          </el-form> 
          <!-- <span class="fl label-dic">类型：</span>
          <el-select class="fl width-minus-100" @change="typeChange" size="middle" v-model="activeTypeId" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
        </el-col>
      </el-row>
      <el-card class="box-card">
        <el-tree
          :data="eachTypeAllTree"
          accordion
          node-key="id"
          :props="defaultProps"
          :expand-on-click-node="false">
          <span class="custom-tree-node my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
            <span>{{ node.label }}</span>
            <span v-if="tempAtId == data.id" class="tree-right-operate">
              <el-button
                type="primary"
                size="mini"
                @click="showDialog('addChild', data)">
                添加子字典
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="showDialog('edit', data)">
                编辑字典
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
    <!-- 编辑/添加字典 -->
    <el-dialog
      :title=" activeTypeDialog == 'add' ? '添加字典': '编辑字典' "
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic" size="middle">
        <el-form-item
          v-if="addType == 'addParent'"
          prop="typeId"
          label="类型："
          :rules="[{ required: activeTypeDialog == 'add' ? true : false, message: '请选择类型', trigger: 'blur' },]">
          <el-select v-model="form.typeId" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="codeStr"
          label="编号："
          :rules="[{ required: activeTypeDialog == 'add' ? true : false, message: '请输入编码', trigger: 'blur' },]">
          <el-input v-model="form.codeStr"></el-input>
        </el-form-item>
        <el-form-item
          prop="name"
          label="名称："
          :rules="[{ required: activeTypeDialog == 'add' ? true : false, message: '请输入名称', trigger: 'blur' },]">
          <el-input v-model="form.name"></el-input>
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
      this.getQueryTreeDictionary();
      this.getQueryTypeList();
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
          "codeStr":   null,
          "name":      null,
          "typeId":    null,
          "curStatus": 0, // 0为编辑/20为删除
          "parent_id": null, //父字典Id
        },
        activeTypeDialog:     'add', //add为新增，edit为编辑
        activeTypeId:         null,  //类型Id
        searchText:           null,  //检索信息
        itemActiveDictonary:  null,  //当前被编辑的字典数据
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
      getQueryTreeDictionary(){
        this.axios.get(`${this.common.basePath}/contrast/all/tree`, this._queryListParams() ).then( (response) => {
           this.eachTypeAllTree = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _queryListParams(){
        return {
          params: {
            typeId:   this.activeTypeId,
            name:     this.searchText,
          }
        }
      },
      /*
       * 查询字典类型
       */
      getQueryTypeList(){
        this.axios.get(`${this.common.basePath}/contrast/all/type/list`,'').then( (response) => {
           this.typeList = response.data.data;
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
        this.elementPageData.pageNum = val;
        this.getQueryTreeDictionary();
      },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){
        this.elementPageData.pageSize = val;
        this.getQueryTreeDictionary();
      },
      /*
       * 根据Id删除字典,curStatus为20表示伪删除
       */
      del(data){
        data.curStatus = '20';
        this.axios.patch(`${this.common.basePath}/contrast/contrast/update/${data.id}`, data).then( (response) => {
           this.getQueryTreeDictionary();
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
        this.addType = type;
        if(type == 'addParent' || type == 'addChild'){
          this.dialogVisible = true;
          this.activeTypeDialog = 'add';
          this.form = {
            "code":   null,
            "name":   null,
            "typeId": null,
          }

          if(type == 'addChild'){ //添加子节点，就需要把父节点的Id传入
            this.form.parent_id = item.id;
            this.form.typeId = item.typeId;
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
            this.activeTypeDialog == 'add' ? this._addDictonary() : this._editDictonary();
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      /*
       * 添加字典
       */
      _addDictonary(){
        this.axios.post(`${this.common.basePath}/contrast/contrast/add`,this.form).then( (response) => {
           this.getQueryTreeDictionary();
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      /*
       * 编辑字典
       */
      _editDictonary(){
        this.form.curStatus = null;
        this.axios.patch(`${this.common.basePath}/contrast/contrast/update/${this.form.id}`,this.form).then( (response) => {
           this.getQueryTreeDictionary();
        }).catch( (error) => {
          this.$message.error(error);            
        });
      },
      typeChange(){
        this.getQueryTreeDictionary();
      },
    },
  }
</script>
<style type="text/css">
  .label-dic{
    line-height: 40px;
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