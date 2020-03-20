<!-- 
  确认正式评审专家
 -->
<template>
  <div>
    <h2 class="page-title">专家评审</h2>
    <div class="block-wrap">
      <h4 class="block-title">确认正式评审专家</h4>
      <div class="block-body">
        <div class="body-content body-contents">
          <el-row :gutter="20">
            <el-col :span="spanNum" class="left-content">
              <el-button type="primary" @click="isShowChoisePage"  v-if="isShowChoiseBtn" class="fr"><i class="fa fa-arrow-right" aria-hidden="true"></i></el-button>
              <h4 class="block-depart-title">建立专家组</h4>
              <el-table max-height="400" v-if="dataExpert" :data="dataExpert" stripe style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable">
                <el-table-column fixed type="selection" width="50"></el-table-column header-align="center" align="center">
                <!-- <el-table-column type="index" label="专家编号" :index="indexMethod" class-name="border-index" width="80"></el-table-column> -->
                <el-table-column prop="name" label="专家姓名" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="phoneNum" label="电话" width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="workUnit" label="工作单位" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="technicalTitle" label="职称" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="contrastname" label="专业领域" width="" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.contrastname">{{item.name+" "}}&nbsp;&nbsp;</span>
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="" header-align="center" align="center" width="180"></el-table-column>
              </el-table>
              <div class="add-del-btn">
                <span class="fa-stack fa-lg">
                  <i class="fa fa-circle fa-stack-2x"></i>
                  <i class="fa fa-exchange fa-rotate-90 fa-stack-1x fa-inverse"></i>
                </span>
              </div>
              <div class="screening">
                <el-button size="small" type="primary" @click="screeningThreeExperts">随机筛选专家</el-button>
                <el-input v-model="num" placeholder="请输入随机筛选的专家数" clearable size='small' style="30%"></el-input>
              </div>
              <el-table max-height="400" :data="newDataExpert" stripe border style="width: 100%;margin: 0 auto;">
                <!-- <el-table-column fixed type="selection" width="50"></el-table-column header-align="center" align="center"> -->
                <!-- <el-table-column type="index" label="专家编号" :index="indexMethod" class-name="border-index" width="80"></el-table-column> -->
                <el-table-column prop="name" label="专家姓名" width="" header-align="center" align="center"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="8" :offset="1">
              <div v-if="isShowChoise">
                <h4 class="block-depart-title">筛选操作</h4>
                <div class="buttons fr">
                  <el-button @click="getCheckedKeys">筛选</el-button>
                </div>
                <div class="clear"></div>
                
                <h4 class="block-depart-title">根据专家领域筛选专家组</h4>
                <el-input
                  placeholder="输入关键字进行筛选"
                  v-model="filterText">
                </el-input>
                <div style="height: 10px;"></div>
                <el-tree
                  :data="treeData"
                  show-checkbox
                  :default-expand-all="false"
                  accordion
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :filter-node-method="filterNode"
                  :props="defaultProps">
                </el-tree>
                <div class="buttons fr">
                  <el-button @click="setCheckedNodes">全选</el-button>
                  <el-button @click="resetChecked">清空</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-bottom">
        <!-- <el-button type="default" icon="" size="small" class="fr">发邮件</el-button> -->
        <el-button type="primary" icon="" size="small" @click="buildExpertGroup" class="center">生成专家组</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .add-del-btn{
    width: 80px;
    margin: 10px auto;
  }
  .screening{
    margin: 10px auto;
    width: 320px;
  }
  .screening .el-input{
    width: 200px;
  }
  .screening .el-button--small{
    padding: 8px 16px;
  }
  .left-content {
    border-right: 2px solid #d0d0d0;
  }
	.center{
		margin: 0 auto;
	}
</style>

<script>
  export default {
    data() {
      return {
        num:1,
        isShowChoise:false,
        isShowChoiseBtn:true,
        elementPageData: {               
          //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        rowData:sessionStorage.getItem("rowReviewInfo"),
        rowDataArr:[],
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
        dataExpert: [],
        newDataExpert: [],
        valueExpert: [],
        arrExpert:[],
				spanNum:24,
      };
    },
    watch:{
      /* 
       输入关键字进行筛选
       */
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      
      /* 
       序号
       */
      indexMethod(index) {
        return (index+1) * 1;
      },
      
      /* 
       表格--选中专家
       */
      handleSelectionChange(val){
        this.newDataExpert = val;
        let idArr = [];
        for(var i = 0;i<val.length;i++){
          idArr.push(val[i].id)
        }
        this.valueExpert = idArr;
      },
      
      /* 
      根据表格列表随机筛选三个专家并设置表格选中状态
      */
      screeningThreeExperts(){
        if(this.num <= 0){
          this.$message.warning('请输入不小于0的专家数', 20);
          return;
        }
        var arr = this.dataExpert;
        //新建一个数组,将传入的数组复制过来,用于运算
        var temp_array = new Array();
        for (var index in arr) {
          temp_array.push(arr[index]);
        }
        //取出的数值项,保存在此数组
        var return_array = new Array();
        for (var i = 0; i<this.num; i++) {
          //判断如果数组还有可以取出的元素
          if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
          } else {
            //数组中数据项取完后,退出循环
            break;
          }
        }
        
        var rows = return_array;
        if (rows) {//设置表格选中状态
        	this.$refs.multipleTable.clearSelection();
        	rows.forEach(row => {
        		this.$refs.multipleTable.toggleRowSelection(row);
        	});
        } else {
        	this.$refs.multipleTable.clearSelection();
        }
        
        this.newDataExpert = return_array;//随机筛选专家
        let idArr = [];
        for(var i = 0;i<return_array.length;i++){
          idArr.push(return_array[i].id)
        }
        this.valueExpert = idArr;
      },
      
      /* 
      是否显示选择专家页面
      */
      isShowChoisePage(){
        this.isShowChoiseBtn = false;
        this.isShowChoise = true;
				this.spanNum = 15;
      },
      
      /* 
        确定该项目专家组名单
       */
      sureGroup(){
        var formData = {
          curStatus:5,
          tips:"已建立正审专家组",
          formalExpertArr:this.valueExpert,
          instanceId:this.rowDataArr[0].processVariables.instanceId,
          assignee:this.rowDataArr[0].processVariables.assignee
        }
        if(this.valueExpert.length==0){
          this.$message.warning("你还未建立正审专家组", 20);
          return;
        }
        this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.$router.push({path: '/project_set_up/review'});
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      /* 
       建立专家组 
       */
      buildExpertGroup(){
        this.$confirm("确认专家组成员并发送评审方案?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.sureGroup();
        })
        .catch(() => {
        })
      },
      
      /* 
        筛选行业
       */
      filterNode(value, data) {

        if (!value) return true;
        return data.nameAndPhone.indexOf(value) !== -1;
      },
      
      /*
      * 获取字典树
      */
      getTree(){
        //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
        this.axios.get(`${this.common.basePath}/contrast/all/tree`,this._assessmentExpertParams()).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.treeData = response.data.data;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _assessmentExpertParams(){
        return {
          params: {
            typeId:2
          }
        }
      },
      
      /*
      * 获取常用专家
      */
      getCommonExpert(){
        this.axios.get(`${this.common.basePath}/hr_users/commused/expert`,this._commonExpertParams()).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.dataExpert = response.data.data.rows;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _commonExpertParams(){
        return {
          params: {}
        }
      },
      
      /* 
        筛选专家项目组
      */
      screen(){
        this.dataExpert = '';
        var formData = {
          industryId:this.$refs.tree.getCheckedKeys(),
          id:4,
        }
        // this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
        this.axios.post(`${this.common.basePath}/hr_users/user/list`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.dataExpert = response.data.data
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      /* 
        筛选按钮
       */
      getCheckedKeys() {
        this.screen();
      },
      
      /* 
       全选按钮
       */
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes(this.treeData);
      },
      
      /* 
       清空按钮
       */
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      
      /* 
        移除专家与添加专家
       */
      handleChange(value) {
        for(var i = 0;i<this.dataExpert.length;i++){
          for(var j = 0;j<this.valueExpert.length;j++){
            if(this.dataExpert[i].id === value[j]){
              this.arrExpert.push(this.dataExpert[i].name)
            }
          }
        }
      },
      
    },
    mounted() {
      var that = this;
      var rowDataArr = [];
      rowDataArr.push(JSON.parse(this.rowData))
      that.rowDataArr = rowDataArr
      
      /* 
      行业展示
      */
      this.getTree();
      
      /* 
       获取常用专家
       */
      this.getCommonExpert();
    },
  }
</script>