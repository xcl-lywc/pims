/***********新增资讯*************/
/* date:   2018/11/05
/* author: zoomze
/********************************/
<!-- 
 项目管理
 -->
<template>
  <div>
    <!-- <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" v-if="detailVisible" @click="detailVisible = false">返回</el-button> -->
    <div v-show="!detailVisible">
      <h2 class="page-title">资讯管理</h2>
      <div class="block-wrap" v-loading="loading">
        <h4 class="block-title">信息列表</h4>
        <div class="block-body">
          <div class="body-operation">
            <el-form :model="searchForm" ref="searchForm" size="middle" label-width="100px" inline class="padt10">
              <el-form-item label="名称" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="请输入资讯名称"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="getTableListData('manual')">搜索</el-button>
                <el-button type="default" @click="resetSearchForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-row class="body-content">
            <el-col :span="24">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <!-- <el-table-column fixed type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" :index="indexMethod" width="60" label="序号" fixed="left" class-name="border-index"></el-table-column>
                <el-table-column prop="aName" label="标题" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建日期">
                  <template slot-scope="scope">
                    {{ common._convertDate(scope.row.createTime, "yyyy年MM月dd日") }}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="creator" label="创建者"></el-table-column> -->
                <el-table-column label="操作" width="280" header-align="center" align="center" fixed="right">
                  <template slot-scope="scope">
                    <div class="text-center">
											<a :href="scope.row.aCover" v-if="scope.row.aCover"  target="view_window" class="marr10">
												<el-button type="success" size="small">
													<i class="fa fa-eye fa-in-button"></i>查看</el-button>
											</a>
											<el-button type="success" size="small" @click="$router.push({name: 'InformationDetail', params: {id: scope.row.id, type: 'view'}})" v-else>
												<i class="fa fa-eye fa-in-button"></i>查看
											</el-button>
                      <el-button type="primary" size="small" @click="$router.push({name: 'InformationDetail', params: {id: scope.row.id, type: 'edit'}})">
                        <i class="fa fa-edit fa-in-button"></i>编辑
                      </el-button>
                      <el-button type="danger" size="small" @click="deleteInformation(scope.row.id)">
                        <i class="fa fa-trash fa-in-button"></i>删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div class="block-bottom">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="currentPerPage"
            background
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- <div class="block-wrap" v-if="detailVisible">
      <el-button class="back-button" type="primary" icon="el-icon-back" size="middle" v-if="detailVisible" @click="detailVisible = false">返回</el-button>
      <h4 class="block-title">{{mode == 'view' ? '资讯信息' : '资讯信息表单'}}</h4>
      <div class="block-body">
        <information-form type="detail" refName="detailForm"></information-form>
      </div>
    </div> -->

  </div> 
</template>

<script>
  import form from "./components/Form.vue"
  export default {
    data() {
      let self = this
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
      return {
        loading: false,

        //表格内容 + 分页
        tableData:         [],
        multipleSelection: [],
        currentPage:    1,
        currentPerPage: 10,
        total:          0,

        //搜索表单
        searchForm: {
          keyWords: null,
        },

        detailVisible: false,
        mode:          "view",
        itemId:        null,

        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        }
      }
    },
    components: {
      "information-form": form
    },
    watch: {
      'editDialogVisible' : {
        handler (newV, oldV) {
          if(!newV && newV != oldV) {
            this.resetForm("expertForm")
          }
        },
        deep: true
      }
    },
    mounted() {
      let self = this
      //查询字典
      self.common.getDictionaryData(2).then((response) => {
        self.industryTree = response
      })
      self.getTableListData()
    },
    methods: {
      /**
       * 返回编号
       * @param  {number} index 当前数据中的index
       * @return {[type]}       [description]
       */
      indexMethod(index) {
        return index + 1 + (this.currentPage - 1) * this.currentPerPage;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.currentPerPage = val
        this.getTableListData() 
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTableListData()
      },
      /**
       * 查询列表
       * @param  {string} manual 是否是点击点击搜索查询 ? 重置分页 : 不清空分页
       * @return {[type]}        [description]
       */
      getTableListData(manual) {
        this.loading = true

        if(manual == "manual") { //手动查询时 重回第一页
          this.currentPage    = 1
        }
        this.searchForm.pageNum  = this.currentPage
        this.searchForm.pageSize = this.currentPerPage

        let cofig = {
          method: "post",
          url:    `${this.common.basePath}/a_info/list`,
          data: this.searchForm
        }

        this.axios(cofig).then((response) => {
          this.tableData = response.data.data.rows
          this.total     = response.data.data.total
          this.loading   = false
        }).catch((error) => {
          this.$message.error(error)
          this.loading = false
        })
      },
      /**
       * 重置表单
       * @return {[type]} [description]
       */
      resetSearchForm () {
        this.$refs.searchForm.resetFields()
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
       * 点击详情/ 编辑
       * @param  {[type]} mode   [description]
       * @param  {[type]} itemId [description]
       * @return {[type]}        [description]
       */
      tableItemClick (mode, itemId) {
        this.mode          = mode
        this.itemId        = itemId
        this.detailVisible = true
        document.getElementsByClassName("content-wrap")[0].scrollTo(0, 0) //回到页面顶部
      },
      
      /**
       * 删除
       * @param  {array} itemId 需要删除的Id数组
       * @return {[type]}         [description]
       */
      deleteInformation(itemId) {
        let self = this
        let config = {
          method: "patch",
          url:    `${self.common.basePath}/a_info/delete/${itemId}`,
          data:   {}
        }

        self.$confirm("删除后需要重新添加", "确认删除", {
          confirmButtonText: "确定",
          cancelButtonText:  "取消",
          type: 'warning',
        }).then(_ => {
          self.axios(config)
          .then((response) => {
            self.$message.success(response.data.meta.message)
            self.getTableListData()
          })
          .catch((error) => {
            self.$message.error(error)
          })
        })
      },
    }
  }
</script>