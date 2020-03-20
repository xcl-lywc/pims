/***********资讯栏目(仅供查看)*************/
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
        <!-- <h4 class="block-title">资讯列表</h4> -->
        <div class="block-body">
					<el-row :gutter="20">
						<!-- <el-col :span="12">
							<div class="grid-content bg-purple">
								<h4 class="block-title">规划政策</h4>
								<el-row class="body-content">
									<el-col :span="24">
										<el-table
											:data="tableData_"
											stripe
											style="width: 100%"
											@selection-change="handleSelectionChange">
											<el-table-column prop="name" label="标题" show-overflow-tooltip></el-table-column>
											<el-table-column label="" width="100" header-align="center" align="center" fixed="right">
												<template slot-scope="scope">
													<div class="text-center">
														<a :href="scope.row.link" target="view_window">
															<el-button type="success" size="small">
																<i class="fa fa-eye fa-in-button"></i>查看
															</el-button>
														</a>
													</div>
												</template>
											</el-table-column>
										</el-table>
									</el-col>
								</el-row>
							</div>
						</el-col> -->
						<el-col :span="12" v-if="industryTree" v-for="(item,index) in industryTree" :key="`${index}行业树`">
							<div class="grid-content bg-purple">
								<h4 class="block-title">
									{{item.name}}
									<i class="el-icon-d-arrow-right fr more" @click="$router.push({name: 'InformationMoreColumn', params: {id: item.id}})">更多</i>
								</h4>
								<el-row class="body-content">
									<el-col :span="24">
										<el-table
											:data="item.tableData"
											stripe
											style="width: 100%"
											@selection-change="handleSelectionChange">
											<!-- <el-table-column fixed type="selection" width="50"></el-table-column> -->
											<!-- <el-table-column type="index" :index="indexMethod" width="60" label="序号" fixed="left" class-name="border-index"></el-table-column> -->
											<el-table-column prop="aName" label="标题" show-overflow-tooltip></el-table-column>
											<!-- <el-table-column prop="createTime" label="创建日期" width="150px">
												<template slot-scope="scope">
													{{ common._convertDate(scope.row.createTime, "yyyy年MM月dd日") }}
												</template>
											</el-table-column> -->
											<!-- <el-table-column prop="creator" label="创建者"></el-table-column> -->
											<el-table-column label="" width="100" header-align="center" align="center" fixed="right">
												<template slot-scope="scope">
													<div class="text-center">
														<a :href="scope.row.aCover" v-if="scope.row.aCover"  target="view_window">
															<el-button type="success" size="small">
																<i class="fa fa-eye fa-in-button"></i>查看
															</el-button>
														</a>
														<el-button type="success" size="small" @click="$router.push({name: 'InformationDetail', params: {id: scope.row.id, type: 'view'}})" v-else>
															<i class="fa fa-eye fa-in-button"></i>查看
														</el-button>
													</div>
												</template>
											</el-table-column>
										</el-table>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
          <!-- <div class="body-operation">
            <el-form :model="searchForm" ref="searchForm" size="middle" label-width="100px" inline class="padt10">
              <el-form-item label="名称" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="请输入资讯名称"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="getTableListData('manual')">搜索</el-button>
                <el-button type="default" @click="resetSearchForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div> -->
        </div>
        <!-- <div class="block-bottom">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="currentPerPage"
            background
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination> -->
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

<style scoped>
	.more{
		padding-top: 22px;
		cursor: pointer;
		color: #000080;
	}
</style>

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
				tableData_:         [
					{
            time: '2017年08月31日',
            name: '五部门印发通知推进落实政务信息系统整合共享方案',
						link:"http://www.cac.gov.cn/2017-08/31/c_1121575524.htm",
          },
					{
            time: '2017年05月19日',
            name: '网信办等三部门联合发文推进"十三五"信息化标准工作',
						link:"http://www.cac.gov.cn/2017-05/19/c_1121003521.htm",
          },
				],
        multipleSelection: [],
        currentPage:    1,
        currentPerPage: 10,
        total:          0,

        //搜索表单
        searchForm: {
          keyWords: null,
					pageNum:  null,
					currentPerPage: null,
					atType: 	null,
        },

        detailVisible: false,
        mode:          "view",
        itemId:        null,

        //行业相关数据(树)
        industryTree: [],
        treeProps: {
          label:    'name',
          children: 'childrens'
        },
				idArr:null,//分类id
				tableData_:new Map(),//表格数据
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
      self.getDictionary()
      // self.getTableListData()
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
			
			/* 
				查询字典
			 */
			getDictionary(){
				let i = 0;
				this.common.getDictionaryData(6).then((response) => {
					for(let i=0;i<response.length;i++){
						console.log("我是第介个",i);
						this.industryTree.push(response[i]);
						this.getTableListData(response[i]).then((responseChild) => {
							response[i].tableData = responseChild.data.data.rows;
							this.industryTree.splice(i,response[i]);
							this.loading = false;
							console.log(response[i], '添加了一个列表');
						}).catch((errorChild) => {
							this.$message.error(errorChild);
						});
					}
					/* response.forEach((item) => { 
						this.getTableListData(item).then((responseChild) => {
							item.tableData = responseChild.data.data.rows;
							this.loading = false;
							this.industryTree.push(item);
							console.log(item, '添加了一个列表');
							i++;
						}).catch((errorChild) => {
							this.$message.error(errorChild);
						});
					}); */
					console.log(response, '看见哈萨克接电话');
				})
			},
			
      /**
       * 查询列表
       * @param  {string} manual 是否是点击点击搜索查询 ? 重置分页 : 不清空分页
       * @return {[type]}        [description]
       */
      getTableListData(item) { 
        this.loading = true
//         if(manual == "manual") { //手动查询时 重回第一页
//           this.currentPage    = 1
//         }
        this.searchForm.pageNum  = this.currentPage
        this.searchForm.pageSize = this.currentPerPage
				this.searchForm.atType = item.id;
				// console.log(item.id,this.searchForm.atType,this.searchForm)
        let cofig = {
          method: "post",
          url:    `${this.common.basePath}/a_info/list`,
          data: {
						pageNum: this.currentPage,
						pageSize: this.currentPerPage,
						atType: item.id,
					}
        }
				console.log(cofig.data)
// 				this.axios(cofig).then((response) => {
// 					this.tableData = response.data.data.rows
// 					console.log(this.tableData)
// 					this.total     = response.data.data.total
// 					this.loading   = false
// 				}).catch((error) => {
// 					this.$message.error(error)
// 					this.loading = false
// 				})
				
				return new Promise ((resolve, reject) => {
					this.axios(cofig).then((response) => {
						resolve(response)
					}).catch((error) => {
						reject(error)
					})
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